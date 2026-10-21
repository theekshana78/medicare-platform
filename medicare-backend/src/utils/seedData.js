import bcrypt from "bcryptjs";
import { db } from "../config/db.js";
import { ROLES } from "../constants/roles.js";
import { APPOINTMENT_STATUS } from "../constants/appointmentStatus.js";

export const seedDatabase = async () => {
  try {
    const doctorsSnap = await db.collection("doctors").get();
    if (!doctorsSnap.empty) {
      return; // Already populated
    }

    console.log("Seeding MediCore initial clinical database...");

    // 1. Seed Demo Doctors
    const doctors = [
      {
        id: "doc-1",
        name: "Dr. Sarah Jenkins",
        qualification: "MBBS, MD (Cardiology), FRCP (UK)",
        specialty: "cardiology",
        specialtyLabel: "Cardiologist",
        hospital: "MediCore Central, OPD Room 204",
        experience: "14 Years Exp.",
        rating: "4.9",
        reviews: 128,
        consultationFee: "LKR 3,500",
        availableToday: true,
        isVerified: true,
        licenseNumber: "SLMC-78901",
      },
      {
        id: "doc-2",
        name: "Dr. David Miller",
        qualification: "MBBS, DCH, MD (Pediatrics)",
        specialty: "pediatrics",
        specialtyLabel: "Pediatric Specialist",
        hospital: "MediCore Children Wing, Room 102",
        experience: "10 Years Exp.",
        rating: "4.8",
        reviews: 94,
        consultationFee: "LKR 3,000",
        availableToday: true,
        isVerified: true,
        licenseNumber: "SLMC-80124",
      },
      {
        id: "doc-3",
        name: "Dr. Robert Taylor",
        qualification: "MBBS, MS (Neuro Surgery), FACS",
        specialty: "neurology",
        specialtyLabel: "Neurologist & Surgeon",
        hospital: "MediCore Neuro Suite, Room 310",
        experience: "18 Years Exp.",
        rating: "5.0",
        reviews: 210,
        consultationFee: "LKR 4,500",
        availableToday: false,
        isVerified: true,
        licenseNumber: "SLMC-66231",
      },
      {
        id: "doc-4",
        name: "Dr. Ananya Senanayake",
        qualification: "MBBS, MS (Orthopedics), FRCS",
        specialty: "orthopedics",
        specialtyLabel: "Orthopedic Surgeon",
        hospital: "MediCore Joint Clinic, Room 115",
        experience: "12 Years Exp.",
        rating: "4.9",
        reviews: 115,
        consultationFee: "LKR 3,800",
        availableToday: true,
        isVerified: true,
        licenseNumber: "SLMC-74192",
      },
      {
        id: "doc-5",
        name: "Dr. Priyantha Fernando",
        qualification: "MBBS, MD (Internal Medicine), FCCP",
        specialty: "general",
        specialtyLabel: "Consultant Physician",
        hospital: "MediCore Medical Tower, Room 201",
        experience: "20 Years Exp.",
        rating: "4.9",
        reviews: 320,
        consultationFee: "LKR 3,200",
        availableToday: true,
        isVerified: true,
        licenseNumber: "SLMC-55910",
      },
    ];

    for (const doc of doctors) {
      await db.collection("doctors").doc(doc.id).set(doc);
    }

    // 2. Seed Default Auth Users (with real bcrypt passwords)
    const patientPassword = await bcrypt.hash("patient123", 10);
    const doctorPassword = await bcrypt.hash("doctor123", 10);
    const adminPassword = await bcrypt.hash("admin123", 10);

    const users = [
      {
        id: "pat-101",
        name: "Kasun Jayawardena",
        email: "patient@medicore.health",
        password: patientPassword,
        role: ROLES.PATIENT,
        phone: "+94 77 123 4567",
        dob: "1994-06-12",
        gender: "male",
        bloodGroup: "O+",
        createdAt: new Date().toISOString(),
      },
      {
        id: "doc-1",
        name: "Dr. Sarah Jenkins",
        email: "dr.jenkins@medicore.health",
        password: doctorPassword,
        role: ROLES.DOCTOR,
        phone: "+94 71 888 9999",
        specialty: "cardiology",
        createdAt: new Date().toISOString(),
      },
      {
        id: "adm-01",
        name: "Admin Theekshana",
        email: "admin@medicore.health",
        password: adminPassword,
        role: ROLES.ADMIN,
        department: "Hospital Administration",
        createdAt: new Date().toISOString(),
      },
    ];

    for (const u of users) {
      await db.collection("users").doc(u.id).set(u);
    }

    // 3. Seed Sample Appointments
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];

    const appointments = [
      {
        id: "apt-1",
        patientId: "pat-101",
        patientName: "Kasun Jayawardena",
        doctorId: "doc-1",
        doctorName: "Dr. Sarah Jenkins",
        specialty: "Cardiologist",
        room: "OPD Room 204",
        fee: "LKR 3,500",
        date: tomorrowStr,
        time: "04:30 PM",
        symptoms: "Routine cardiac checkup & ECG review",
        status: APPOINTMENT_STATUS.CONFIRMED,
        createdAt: new Date().toISOString(),
      },
      {
        id: "apt-2",
        patientId: "pat-101",
        patientName: "Kasun Jayawardena",
        doctorId: "doc-2",
        doctorName: "Dr. David Miller",
        specialty: "Pediatric Specialist",
        room: "Room 102",
        fee: "LKR 3,000",
        date: "2026-10-24",
        time: "10:15 AM",
        symptoms: "Pediatric allergy consultation",
        status: APPOINTMENT_STATUS.PENDING,
        createdAt: new Date().toISOString(),
      },
    ];

    for (const a of appointments) {
      await db.collection("appointments").doc(a.id).set(a);
    }

    console.log("✓ MediCore database successfully populated with initial clinical records.");
  } catch (err) {
    console.error("Database seeding notice:", err.message);
  }
};
