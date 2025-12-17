export interface ContainerDef {
  id: string;
  name: string;
  capacity: number; // in ml
  initialAmount: number; // in ml
  spriteUrl?: string; // URL to image asset
}

export interface TargetState {
  containerId: string;
  amount: number;
}

export interface Level {
  id: number;
  title: string;
  description: string;
  hasSinkAndTap: boolean; // If true, user can empty to sink and fill from tap
  tapSpriteUrl?: string; // Optional sprite for the tap
  sinkSpriteUrl?: string; // Optional sprite for the sink
  containers: ContainerDef[];
  targets: TargetState[];
}

export interface ContainerState {
  id: string;
  currentAmount: number;
}