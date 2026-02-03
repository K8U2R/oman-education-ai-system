import { IAIProvider } from "@/domain/interfaces/ai/IAIProvider";
import { OAuthState } from "@/domain/entities/OAuthState";

declare global {
  // eslint-disable-next-line no-var
  var __oman_education_oauth_state_storage__:
    | Map<string, OAuthState>
    | undefined;

  // Backward compatibility
  // eslint-disable-next-line no-var
  var __oauthStateStorage: Map<string, OAuthState> | undefined;

  // AI Provider global setter
  // eslint-disable-next-line no-var
  var setAIProvider: (provider: IAIProvider) => void;
}

export {};
