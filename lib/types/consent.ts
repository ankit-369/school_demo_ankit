export type ConsentStatus = "pending" | "signed";

export type ConsentRecord = {
  id: string;
  formName: string;
  studentId: string;
  campId?: string;
  status: ConsentStatus;
};
