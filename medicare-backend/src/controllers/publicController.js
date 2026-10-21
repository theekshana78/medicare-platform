import { db } from "../config/db.js";
import { successResponse } from "../utils/response.js";
import { ROLES } from "../constants/roles.js";

export const getPublicPlatformSummary = async (req, res, next) => {
  try {
    const doctorsSnap = await db.collection("doctors").get();
    const allDoctors = doctorsSnap.docs.map((d) => ({ ...d.data(), id: d.id }));
    const verifiedDoctors = allDoctors.filter((d) => d.isVerified);

    const usersSnap = await db.collection("users").get();
    const totalPatients = usersSnap.docs.filter((d) => d.data().role === ROLES.PATIENT).length;

    const appointmentsSnap = await db.collection("appointments").get();
    const totalAppointments = appointmentsSnap.size || appointmentsSnap.docs?.length || 0;

    // Distinct Department distribution
    const deptMap = {};
    verifiedDoctors.forEach((doc) => {
      const dept = doc.specialtyLabel || doc.specialty || "General";
      deptMap[dept] = (deptMap[dept] || 0) + 1;
    });

    const departments = Object.entries(deptMap).map(([title, doctorCount]) => ({
      title,
      doctorCount,
    }));

    return successResponse(res, 200, "Public clinical platform summary retrieved.", {
      totalPatients,
      activeDoctors: verifiedDoctors.length,
      totalAppointments,
      departments,
      featuredDoctors: verifiedDoctors.slice(0, 3),
    });
  } catch (err) {
    next(err);
  }
};
