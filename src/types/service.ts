export interface Service {
  id: number;
  growth_factor_name: string;
  growth_factor_description: string | null;
  growth_factor_status: 'черновик' | 'опубликован' | 'удален';
  image_url: string | null;
  video_url: string | null;
  growth_coefficient: number | null;
  storage_impact_coefficient: number | null;
  created_at: string;
  formed_at: string | null;
  likes_count: number;
  is_creator: 0 | 1;
  is_liked: 0 | 1;
  /** Поле используется только mock-коллекцией для фильтра темы. */
  category?: string;
}

export type ServiceSort = 'newest' | 'oldest' | 'name' | 'growth';
