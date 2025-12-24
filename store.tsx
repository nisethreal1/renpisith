import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  AppState,
  UserRole,
  Class,
  Student,
  AttendanceRecord,
  PermissionRequest,
  AttendanceStatus,
  PermissionStatus,
  UserAccount,
} from "./types";

interface AppContextType {
  state: AppState;
  loginTeacher: (email: string, pass: string) => boolean;
  registerTeacher: (name: string, email: string, pass: string) => boolean;
  loginStudent: (studentId: string) => boolean;
  logout: () => void;
  addClass: (cls: Omit<Class, "id">) => void;
  updateClass: (id: string, updates: Partial<Class>) => void;
  addStudent: (std: Omit<Student, "id">) => void;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  markAttendance: (
    records: Omit<AttendanceRecord, "id" | "locked" | "editHistory">[]
  ) => void;
  overrideAttendance: (
    recordId: string,
    status: AttendanceStatus,
    reason: string
  ) => void;
  submitPermission: (
    req: Omit<PermissionRequest, "id" | "status" | "createdAt">
  ) => void;
  updatePermissionStatus: (
    id: string,
    status: PermissionStatus,
    comment?: string
  ) => void;
  clearAll: () => void;
}

const STORAGE_KEY = "sams_storage_v2";

const INITIAL_STATE: AppState = {
  users: [
    {
      id: "u1",
      name: "lecturer",
      email: "lec@school.com",
      password: "aub123",
      role: UserRole.TEACHER,
    },
  ],
  classes: [
    {
      id: "c1",
      name: "FINTECH",
      description: "Financial Technology",
      isActive: true,
    },
    {
      id: "c2",
      name: "BUSINESS IT",
      description: "Business Information Technology",
      isActive: true,
    },
  ],
  students: [
    {
      id: "STD-5090",
      name: "Ren Pisith",
      dob: "2006-02-05",
      origin: "Kampong Thum",
      phone: "123-456-7890",
      classId: "c1",
      isArchived: false,
    },
    {
      id: "STD-5091",
      name: "Vuthea Vireakboth",
      dob: "2008-08-20",
      origin: "Phnom Penh",
      phone: "098-765-4321",
      classId: "c1",
      isArchived: false,
    },
    {
      id: "STD-5092",
      name: "Hum Khemra",
      dob: "2008-01-10",
      origin: "Banteay Meanchey",
      phone: "555-123-4567",
      classId: "c2",
      isArchived: false,
    },
  ],
  attendance: [],
  permissions: [],
  currentUser: null,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_STATE;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const loginTeacher = (email: string, pass: string) => {
    const user = state.users.find(
      (u) => u.email === email && u.password === pass
    );
    if (user) {
      setState((prev) => ({
        ...prev,
        currentUser: { id: user.id, role: UserRole.TEACHER, name: user.name },
      }));
      return true;
    }
    return false;
  };

  const registerTeacher = (name: string, email: string, pass: string) => {
    if (state.users.some((u) => u.email === email)) return false;
    const newUser: UserAccount = {
      id: `u_${Date.now()}`,
      name,
      email,
      password: pass,
      role: UserRole.TEACHER,
    };
    setState((prev) => ({
      ...prev,
      users: [...prev.users, newUser],
      currentUser: {
        id: newUser.id,
        role: UserRole.TEACHER,
        name: newUser.name,
      },
    }));
    return true;
  };

  const loginStudent = (studentId: string) => {
    const student = state.students.find(
      (s) => s.id === studentId && !s.isArchived
    );
    if (student) {
      setState((prev) => ({
        ...prev,
        currentUser: {
          id: student.id,
          role: UserRole.STUDENT,
          name: student.name,
          studentId: student.id,
        },
      }));
      return true;
    }
    return false;
  };

  const logout = () => {
    setState((prev) => ({ ...prev, currentUser: null }));
  };

  const addClass = (cls: Omit<Class, "id">) => {
    const newClass = { ...cls, id: `class_${Date.now()}` };
    setState((prev) => ({ ...prev, classes: [...prev.classes, newClass] }));
  };

  const updateClass = (id: string, updates: Partial<Class>) => {
    setState((prev) => ({
      ...prev,
      classes: prev.classes.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    }));
  };

  const addStudent = (std: Omit<Student, "id">) => {
    const newStd = {
      ...std,
      id: `STD-${Math.floor(Math.random() * 9000) + 1000}`,
    };
    setState((prev) => ({ ...prev, students: [...prev.students, newStd] }));
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setState((prev) => ({
      ...prev,
      students: prev.students.map((s) =>
        s.id === id ? { ...s, ...updates } : s
      ),
    }));
  };

  const markAttendance = (
    records: Omit<AttendanceRecord, "id" | "locked" | "editHistory">[]
  ) => {
    const newRecords = records.map((r) => ({
      ...r,
      id: `att_${Date.now()}_${r.studentId}`,
      locked: true,
      editHistory: [],
    }));
    setState((prev) => ({
      ...prev,
      attendance: [...prev.attendance, ...newRecords],
    }));
  };

  const overrideAttendance = (
    recordId: string,
    status: AttendanceStatus,
    reason: string
  ) => {
    setState((prev) => ({
      ...prev,
      attendance: prev.attendance.map((a) =>
        a.id === recordId
          ? {
              ...a,
              status,
              editHistory: [
                ...(a.editHistory || []),
                {
                  timestamp: new Date().toISOString(),
                  userId: state.currentUser?.id || "sys",
                  action: `Changed status to ${status}`,
                  reason,
                },
              ],
            }
          : a
      ),
    }));
  };

  const submitPermission = (
    req: Omit<PermissionRequest, "id" | "status" | "createdAt">
  ) => {
    const newReq: PermissionRequest = {
      ...req,
      id: `req_${Date.now()}`,
      status: PermissionStatus.PENDING,
      createdAt: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      permissions: [...prev.permissions, newReq],
    }));
  };

  const updatePermissionStatus = (
    id: string,
    status: PermissionStatus,
    comment?: string
  ) => {
    setState((prev) => {
      const updatedPermissions = prev.permissions.map((p) =>
        p.id === id ? { ...p, status, teacherComment: comment } : p
      );

      let updatedAttendance = [...prev.attendance];
      if (status === PermissionStatus.APPROVED) {
        const req = prev.permissions.find((p) => p.id === id);
        if (req) {
          const existingAttIndex = updatedAttendance.findIndex(
            (a) => a.studentId === req.studentId && a.date === req.date
          );
          if (existingAttIndex > -1) {
            updatedAttendance[existingAttIndex] = {
              ...updatedAttendance[existingAttIndex],
              status: AttendanceStatus.PERMISSION,
            };
          } else {
            updatedAttendance.push({
              id: `att_${Date.now()}_${req.studentId}`,
              studentId: req.studentId,
              classId: req.classId,
              date: req.date,
              status: AttendanceStatus.PERMISSION,
              locked: true,
              note: `System: Permission Approved - ${req.reason}`,
            });
          }
        }
      }

      return {
        ...prev,
        permissions: updatedPermissions,
        attendance: updatedAttendance,
      };
    });
  };

  const clearAll = () => setState(INITIAL_STATE);

  return (
    <AppContext.Provider
      value={{
        state,
        loginTeacher,
        registerTeacher,
        loginStudent,
        logout,
        addClass,
        updateClass,
        addStudent,
        updateStudent,
        markAttendance,
        overrideAttendance,
        submitPermission,
        updatePermissionStatus,
        clearAll,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
