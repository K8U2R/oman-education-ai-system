export interface CreateProjectDTO {
  title: string;
  description?: string;
  subject_id?: string;
}

export interface UpdateProjectDTO {
  title?: string;
  description?: string;
  status?: string;
}
