/**
 * Player Details Helper
 * 
 * Different games require different player identification fields.
 * This file defines what each game needs.
 */

export type GameType = 'mobile-legends' | 'pubg-mobile' | 'genshin-impact' | 'honor-of-kings' | 'bgmi' | 'wuthering-waves' | 'zenless-zone-zero' | 'honkai-star-rail' | 'other';

/**
 * Required fields for each game
 */
export interface GamePlayerRequirements {
  playerId: {
    required: boolean;
    label: string;
    placeholder: string;
    type: 'text' | 'number';
  };
  zoneId?: {
    required: boolean;
    label: string;
    placeholder: string;
    type: 'text' | 'number';
  };
  server?: {
    required: boolean;
    label: string;
    options: string[];
  };
  hasVerification: boolean;
}

/**
 * Game-specific requirements
 */
export const GAME_PLAYER_REQUIREMENTS: Record<string, GamePlayerRequirements> = {
  'mobile-legends': {
    playerId: {
      required: true,
      label: 'Player ID',
      placeholder: '1234567890',
      type: 'number',
    },
    zoneId: {
      required: true,
      label: 'Zone ID',
      placeholder: '7890',
      type: 'number',
    },
    hasVerification: true, // Uses /api/games/check-region
  },
  
  'pubg-mobile': {
    playerId: {
      required: true,
      label: 'Player ID',
      placeholder: '5123456789',
      type: 'number',
    },
    hasVerification: false,
  },
  
  'bgmi': {
    playerId: {
      required: true,
      label: 'Player ID',
      placeholder: '5123456789',
      type: 'number',
    },
    hasVerification: true, // Uses OneAPI validation
  },
  
  'genshin-impact': {
    playerId: {
      required: true,
      label: 'UID',
      placeholder: '612345678',
      type: 'number',
    },
    server: {
      required: true,
      label: 'Server',
      options: ['Asia', 'America', 'Europe', 'TW/HK/MO'],
    },
    hasVerification: false,
  },
  
  'honor-of-kings': {
    playerId: {
      required: true,
      label: 'Player ID',
      placeholder: '1234567890',
      type: 'number',
    },
    zoneId: {
      required: true,
      label: 'Zone ID',
      placeholder: '1234',
      type: 'number',
    },
    hasVerification: false, // May be added later
  },
  
  'where-winds-meet': {
    playerId: {
      required: true,
      label: 'UID',
      placeholder: '12345678',
      type: 'text',
    },
    hasVerification: false,
  },
  
  'wuthering-waves': {
    playerId: {
      required: true,
      label: 'UID',
      placeholder: '612345678',
      type: 'number',
    },
    server: {
      required: true,
      label: 'Server',
      options: ['Asia', 'America', 'Europe', 'TW/HK/MO'],
    },
    hasVerification: false,
  },
  
  'zenless-zone-zero': {
    playerId: {
      required: true,
      label: 'UID',
      placeholder: '612345678',
      type: 'number',
    },
    server: {
      required: true,
      label: 'Server',
      options: ['Asia', 'America', 'Europe', 'TW/HK/MO'],
    },
    hasVerification: false,
  },
  
  'honkai-star-rail': {
    playerId: {
      required: true,
      label: 'UID',
      placeholder: '612345678',
      type: 'number',
    },
    server: {
      required: true,
      label: 'Server',
      options: ['Asia', 'America', 'Europe', 'TW/HK/MO'],
    },
    hasVerification: false,
  },
};

/**
 * Get requirements for a game
 */
export function getPlayerRequirements(gameSlug: string): GamePlayerRequirements {
  return GAME_PLAYER_REQUIREMENTS[gameSlug] || {
    playerId: {
      required: true,
      label: 'Player ID',
      placeholder: 'Enter your Player ID',
      type: 'text',
    },
    hasVerification: false,
  };
}

/**
 * Validate player details for a game
 */
export function validatePlayerDetails(
  gameSlug: string,
  playerDetails: { playerId?: string; zoneId?: string; server?: string }
): { valid: boolean; errors: string[] } {
  const requirements = getPlayerRequirements(gameSlug);
  const errors: string[] = [];

  if (requirements.playerId.required && !playerDetails.playerId) {
    errors.push(`${requirements.playerId.label} is required`);
  }

  if (requirements.zoneId?.required && !playerDetails.zoneId) {
    errors.push(`${requirements.zoneId.label} is required`);
  }

  if (requirements.server?.required && !playerDetails.server) {
    errors.push(`${requirements.server.label} is required`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
