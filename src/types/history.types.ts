// ========== DTOs ==========

export interface UpdateListenPositionDTO {
  songId: string;
  position: number;
}

export interface ListenPositionResponseDTO {
  songId: string;
  position: number;
  updatedAt: Date | null;
}

export interface ListenHistoryPaginationDTO {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ListenHistoryResponseDTO {
  data: unknown[];
  pagination: ListenHistoryPaginationDTO;
}
