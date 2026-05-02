export type CreateDoctorDto = {
  name: string;
  cmp: string;
  specialtyIds: string[];
};

export type UpdateDoctorDto = Partial<CreateDoctorDto>;
