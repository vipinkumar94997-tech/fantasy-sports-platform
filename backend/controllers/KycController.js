import KYC from "../models/KYC.js";
import User from "../models/User.js";

// KYC Submit
export const submitKYC = async (req, res) => {
  try {
    const { aadhaarNumber, aadhaarImage, panNumber, panImage } = req.body;
    console.log("KYC Data received:");
    console.log("aadhaarNumber:", aadhaarNumber);
    console.log("panNumber:", panNumber);
    console.log("aadhaarImage length:", aadhaarImage?.length);
    console.log("panImage length:", panImage?.length);

    const userId = req.user.id;

    if (!aadhaarNumber || !panNumber)
      return res.status(400).json({ message: "Aadhaar and PAN required" });

    const existing = await KYC.findOne({ where: { userId } });
    if (existing && existing.status === "verified")
      return res.status(400).json({ message: "KYC already verified" });

    if (existing) {
      await existing.update({
        aadhaarNumber,
        aadhaarImage,
        panNumber,
        panImage,
        status: "pending",
      });
    } else {
      await KYC.create({
        userId,
        aadhaarNumber,
        aadhaarImage,
        panNumber,
        panImage,
      });
    }

    await User.update({ kycStatus: "pending" }, { where: { id: userId } });

    res.json({ message: "KYC submitted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// KYC Status
export const getKYCStatus = async (req, res) => {
  try {
    const kyc = await KYC.findOne({ where: { userId: req.user.id } });
    res.json({ kyc });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin — Get All KYC
// export const getAllKYC = async (req, res) => {
//   try {
//     const { status = "pending" } = req.query;
//     const kycList = await KYC.findAll({ where: { status } });
//     res.json({ kycList });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

export const getAllKYC = async (req, res) => {
  try {
    const { status = "pending" } = req.query;
    const kycList = await KYC.findAll({
      where: { status },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "phone"],
        },
      ],
    });
    res.json({ kycList });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin — Approve KYC
export const approveKYC = async (req, res) => {
  try {
    const kyc = await KYC.findByPk(req.params.id);
    if (!kyc) return res.status(404).json({ message: "KYC not found" });

    await kyc.update({ status: "verified" });
    await User.update({ kycStatus: "verified" }, { where: { id: kyc.userId } });

    res.json({ message: "KYC approved" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin — Reject KYC
export const rejectKYC = async (req, res) => {
  try {
    const { reason } = req.body;
    const kyc = await KYC.findByPk(req.params.id);
    if (!kyc) return res.status(404).json({ message: "KYC not found" });

    await kyc.update({ status: "rejected", rejectionReason: reason });
    await User.update({ kycStatus: "rejected" }, { where: { id: kyc.userId } });

    res.json({ message: "KYC rejected" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
