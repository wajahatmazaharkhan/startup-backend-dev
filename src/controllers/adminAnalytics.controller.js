import { PageAnalytics } from "../models/PageAnalytics.model.js";

export const analyticsDashboard = async (req, res) => {
  try {
    const pages = await PageAnalytics.aggregate([
      {
        $group: {
          _id: "$page",
          views: { $sum: 1 }
        }
      },
      {
        $sort: { views: -1 }
      }
    ]);

    const daily = await PageAnalytics.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          visits: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const totalVisits = await PageAnalytics.countDocuments();

    return res.status(200).json({
      success: true,
      pages,
      daily,
      totalVisits
    });
  } catch (error) {
    console.log("🚀 ~ analyticsDashboard ~ error:", error.message);
    return res.status(500).json({
      success: false,
      msg: "Analytics error",
      error: error.message
    });
  }
};
