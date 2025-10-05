# Mission Creation Flow

## Overview

AstraCAD now features an AI-powered mission creation system that automatically generates complete lunar base layouts based on user-specified parameters.

## User Flow

### Step 1: Mission Configuration

Users specify:

- **Crew Size**: 1-20 people
- **Mission Duration**: 1-365 days

The system provides a preview of what AI will create based on these parameters.

### Step 2: Mission Objective

Users describe their mission goals in detail. Examples:

- Geological surveys
- Long-term habitation studies
- ISRU technology testing
- Lunar resource extraction

The more specific the objective, the better AI can tailor the base layout.

### Step 3: Review Mission Details

AI generates mission details (fast, ~2-3 seconds):

- **Mission Title**: Compelling, context-aware title
- **Mission Description**: Detailed 2-3 sentence description

Users can:

- Review the generated title and description
- Edit them as desired before launching
- See what will be created (crew size, duration)

### Step 4: Launch Mission

When the user clicks "Launch Mission":

1. AI generates the complete base layout (~10-15 seconds)
2. Hub is saved to localStorage
3. User is redirected to the main CAD interface

This two-step approach ensures users can review and customize mission details before committing to the full base generation.

## Technical Implementation

### Two-Step Generation Process

The mission creation is split into two API endpoints for better UX:

#### 1. `/api/generate-mission-info.ts` (Fast - ~2-3 seconds)

Generates mission title and description for user review.

**Input:**

```typescript
{
	crewSize: number;
	missionDays: number;
	objective: string;
}
```

**Output:**

```typescript
{
	success: boolean;
	title: string;
	description: string;
}
```

#### 2. `/api/generate-hub.ts` (Slower - ~10-15 seconds)

Generates the complete base layout after user confirms mission details.

**Input:**

```typescript
{
  crewSize: number;
  missionDays: number;
  objective: string;
  title: string;
  description: string;
  availableItems: Item[];
}
```

**Process:**

1. Uses the confirmed mission details
2. Designs a complete base layout with proper floor distribution
3. Places items strategically based on:
   - Crew size requirements
   - Mission duration
   - Functional grouping (command, crew, life-support, etc.)
   - Noise separation (noisy systems away from crew quarters)
   - Realistic spacing and positioning

**Output:**

```typescript
{
	success: boolean;
	hub: Hub; // Complete hub with floors and items
	stats: {
		totalFloors: number;
		totalItems: number;
	}
}
```

### Key Features

1. **Intelligent Floor Allocation**
   - 1-2 crew: 1 floor
   - 3-4 crew: 2 floors
   - 5+ crew: 3 floors

2. **Essential Systems**
   - Sleeping pods (1 per crew member minimum)
   - Command and control systems
   - Life support (oxygen, CO2 scrubber, water recycler, thermal control)
   - Medical facilities
   - Galley and dining areas
   - Storage scaled to mission duration
   - Airlock and EVA equipment
   - Power systems

3. **Smart Positioning**
   - Realistic coordinate ranges (x, z: -8 to 8, y: 0-2.5)
   - No overlapping items
   - Functional grouping
   - Noise considerations

### Redirect Logic

The main page (`/pages/index.vue`) now checks on mount:

```typescript
if (
	!sceneManager.hub ||
	!sceneManager.hub.floors ||
	sceneManager.hub.floors.length === 0
) {
	router.push("/new");
}
```

This ensures new users always start with the mission creation flow.

## AI Tools Integration

The mission generation system uses the same AI architecture as the chat system:

- Leverages Gemini 2.5 Flash for fast generation
- Uses structured output with Zod schemas
- Maintains consistency with existing tool patterns

## User Experience Enhancements

- **Real-time Validation**: Form validates inputs at each step
- **Progress Indication**: Visual stepper shows current position
- **Loading States**: Clear feedback during AI generation
- **Editable Output**: Users maintain control over AI-generated content
- **Regeneration**: Don't like the result? Regenerate with one click
- **Statistics Display**: See what was created before launching

## Future Enhancements

Potential improvements:

- Mission templates (research, mining, exploration, etc.)
- Advanced constraints (budget, mass limits, power capacity)
- Multi-mission comparison
- Export mission specifications
- Community mission sharing
