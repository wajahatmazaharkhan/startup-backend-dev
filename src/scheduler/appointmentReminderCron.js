// ===============================================================
// ⏰ Appointment Reminder Cron Job
// ===============================================================
import cron from "node-cron";
import { Appointment } from "../models/Appointment.model.js";
import { Notification } from "../models/Notifications.model.js";
import { sendRealtimeNotification } from "../realtime/sendRealtimeNotification.js";

// ---------------------------------------------------------------
// Check every minute for appointments happening soon
// ---------------------------------------------------------------
export const startAppointmentReminderCron = () => {
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

      // 1️⃣ Find appointments that start in 1 hour and not yet reminded
      const appointments = await Appointment.find({
        date: { $gte: now, $lte: oneHourLater },
        status: "booked",
        reminderSent: { $ne: true }, // make sure we don't send twice
      }).populate("userId");

      // 2️⃣ Send reminders
      for (const appt of appointments) {
        // Save notification
        await Notification.create({
          userId: appt.userId._id,
          title: "Appointment Reminder",
          body: `You have an appointment at ${appt.time}`,
          type: "reminder",
          channel: "in-app",
          meta: { appointmentId: appt._id },
        });

        // Realtime push
        sendRealtimeNotification(appt.userId._id, {
          title: "Appointment Reminder",
          body: `You have an appointment at ${appt.time}`,
          type: "reminder",
          meta: { appointmentId: appt._id },
        });

        // Mark appointment as reminded
        appt.reminderSent = true;
        await appt.save();
      }

      if (appointments.length > 0) {
        console.log(`⏰ Sent ${appointments.length} appointment reminders`);
      }
    } catch (error) {
      console.error("Appointment Reminder Cron Error:", error.message);
    }
  });
};
