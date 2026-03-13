export type UsageWindow = {
  label: string;
  usedPercent: number;
  resetAt?: number;
};

export type ProviderUsageSnapshot = {
  provider: UsageProviderId;
  displayName: string;
  windows: UsageWindow[];
  plan?: string;
  error?: string;
  /**
   * Optional auth profile identifier when usage is scoped to a single profile
   * (for example, multiple OpenAI Codex accounts under the same provider id).
   * When undefined, the snapshot represents provider-level aggregation.
   */
  profileId?: string;
};

export type UsageSummary = {
  updatedAt: number;
  providers: ProviderUsageSnapshot[];
};

export type UsageProviderId =
  | "anthropic"
  | "github-copilot"
  | "google-gemini-cli"
  | "minimax"
  | "openai-codex"
  | "xiaomi"
  | "zai";
