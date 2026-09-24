export interface Skill {
  id: number;
  name: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'Tools';
  displayOrder: number;
}