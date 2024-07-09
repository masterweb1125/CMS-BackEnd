import { roleModel } from "../model/role.model.js";
import { userModel } from "../model/user.model.js";
import BookingModel from "../model/tourbooking.model.js"
import { tourModel } from "../model/booking.model.js";


// import roleModel from '../model/role.model.js';
// import userModel from '../model/user.model.js';

export const GetAllAgencies = async (req, res) => {
  try {
    const role = await roleModel.findOne({ rolename: "agency" });

    if (!role) {
      return res.status(404).json({ msg: "Role not found", status: false });
    }

    const searchQuery = req.query.search || ''; // Get the search query from request query parameters

    // Fetch all agencies
    const agencies = await userModel.find({
      roleId: role._id,
      // Add additional filters if needed, e.g., name: { $regex: searchQuery, $options: 'i' }
    });

    const totalAgency = agencies.length;

    // Example: Fetch recent bookings (adjust this part based on your booking model)
    const recentBookings = await BookingModel.find({
      agencyId: { $in: agencies.map(agency => agency._id) },
      createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) } // Example: Fetch bookings from the last month
    });

    const currentMonthBookings = await BookingModel.find({
      agencyId: { $in: agencies.map(agency => agency._id) },
      createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth())) } // Example: Fetch bookings from the current month
    });

    const previousMonthBookings = await BookingModel.find({
      agencyId: { $in: agencies.map(agency => agency._id) },
      createdAt: {
        $gte: new Date(new Date().setMonth(new Date().getMonth() - 2)),
        $lt: new Date(new Date().setMonth(new Date().getMonth() - 1))
      } // Example: Fetch bookings from the previous month
    });

    const recentBookingCount = recentBookings.length;
    const currentMonthBookingCount = currentMonthBookings.length;
    const previousMonthBookingCount = previousMonthBookings.length;

    // Calculate percentage change in bookings
    const percentageChange = ((currentMonthBookingCount - previousMonthBookingCount) / (previousMonthBookingCount || 1)) * 100;

    // Calculate recent bookings as a percentage of total agencies
    const recentBookingPercentage = (recentBookingCount / totalAgency) * 100;

    res.status(200).json({
      data: agencies,
      status: true,
      totalAgency,
      recentBookingCount,
      recentBookingPercentage,
      currentMonthBookingCount,
      previousMonthBookingCount,
      percentageChange
    });
  } catch (error) {
    res.status(500).json({ msg: error.message, status: false });
  }
};

const getCurrentMonthRange = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return { start, end };
};

// Function to get the start and end dates of the previous month
const getLastMonthRange = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const end = new Date(now.getFullYear(), now.getMonth(), 0);
  return { start, end };
};

export const getAgencyDashboardAnalytics= async (req, res) => {
  try {
    const COMMISSION_PERCENTAGE = 0.10;
    const { agencyId } = req.params;
    const currentDate = new Date();
    const oneDayLater = new Date(currentDate);
    oneDayLater.setDate(currentDate.getDate() + 1);

    const currentMonthRange = getCurrentMonthRange();
    const lastMonthRange = getLastMonthRange();

    // Fetch recent bookings
    const recentBookings = await BookingModel.find({
      agencyId: agencyId,
      bookingDate: {
        $gte: oneDayLater,
      }
    });

    // Fetch current month bookings
    const currentMonthBookings = await BookingModel.find({
      agencyId: agencyId,
      bookingDate: {
        $gte: currentMonthRange.start,
        $lte: currentMonthRange.end
      }
    });

    // Fetch last month bookings
    const lastMonthBookings = await BookingModel.find({
      agencyId: agencyId,
      bookingDate: {
        $gte: lastMonthRange.start,
        $lte: lastMonthRange.end
      }
    });
    const totalagencybookings = await BookingModel.find({agencyId:agencyId})
    // console.log(totalagencybookings)

    // Calculate total commission earned
    const totalCommission = totalagencybookings.reduce((acc, booking) => acc + (booking.totalPrice * COMMISSION_PERCENTAGE), 0);

    // Calculate current month commission
    const currentMonthProfit = currentMonthBookings.reduce((acc, booking) => acc + (booking.totalPrice * COMMISSION_PERCENTAGE), 0);

    // Calculate last month commission
    const lastMonthProfit = lastMonthBookings.reduce((acc, booking) => acc + (booking.totalPrice * COMMISSION_PERCENTAGE), 0);

    // Calculate percentage difference in commissions
    const profitPercentageDifference = lastMonthProfit === 0 ? 100 : ((currentMonthProfit - lastMonthProfit) / lastMonthProfit) * 100;
    //   calculate Current Incentives 

    // Calculate total current incentives (assuming it's 5% of total price)
    const CURRENT_INCENTIVES_PERCENTAGE = 0.05; // Assuming current incentives rate is 5%
    const totalCurrentIncentives = recentBookings.reduce((acc, booking) => acc + (booking.totalPrice * CURRENT_INCENTIVES_PERCENTAGE), 0);

    // Calculate current month incentives
    const currentMonthIncentives = currentMonthBookings.reduce((acc, booking) => acc + (booking.totalPrice * CURRENT_INCENTIVES_PERCENTAGE), 0);

    // Calculate last month incentives
    const lastMonthIncentives = lastMonthBookings.reduce((acc, booking) => acc + (booking.totalPrice * CURRENT_INCENTIVES_PERCENTAGE), 0);

    // Calculate percentage difference in commissions
    // const profitPercentageDifference = lastMonthProfit === 0 ? 100 : ((currentMonthProfit - lastMonthProfit) / lastMonthProfit) * 100;

    // Calculate percentage difference in incentives
    const incentivesPercentageDifference = lastMonthIncentives === 0 ? 100 : ((currentMonthIncentives - lastMonthIncentives) / lastMonthIncentives) * 100;


    // Calculate percentage difference in booking counts
    const currentMonthCount = currentMonthBookings.length;
    const lastMonthCount = lastMonthBookings.length;
    const percentageDifference = lastMonthCount === 0 ? 100 : ((currentMonthCount - lastMonthCount) / lastMonthCount) * 100;

    res.json({
      recentBookings,
      statistics: {
        currentMonthCount,
        lastMonthCount,
        percentageDifference,
        totalCommission,
        currentMonthProfit,
        lastMonthProfit,
        profitPercentageDifference,
        totalCurrentIncentives,
        currentMonthIncentives,
        lastMonthIncentives,
        incentivesPercentageDifference
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const getTourByAgencyId = async(req,res)=>{
  try {
    const agencyId = req.params.id
    const tour = await tourModel.find({agencyId:agencyId})

     res.status(200).json({data:tour,status:true})
  } catch (error) {
    res.status(500).json({msg:error.message,status:false})
  }
}