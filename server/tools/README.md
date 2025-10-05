# AI Tools for Lunar Base CAD System

This directory contains tool definitions that the LLM can call to access and analyze the lunar base design.

## Available Tools

### 1. `getAISuggestions`

**File:** `get-ai-suggestions.ts`

Get current AI-generated suggestions, warnings, and errors about the lunar base design.

**When to use:**

- User asks about problems, issues, fixes, errors, or warnings
- First step in "Fix with AI" workflow

**Returns:**

- Summary of suggestions count by type
- List of all suggestions with type, title, and description
- Error, warning, and info counts

---

### 2. `getHubLayout`

**File:** `get-hub-layout.ts`

Get the current lunar base (hub) configuration including all floors, placed items, and their specifications.

**When to use:**

- User asks about their current base layout
- Second step in "Fix with AI" workflow (to understand current state)
- Analyzing what items are already placed

**Parameters:**

- `includeItemDetails` (optional, boolean): Include detailed specs for each item (default: true)

**Returns:**

- Hub title, description, and author
- Statistics: total floors, items, volume usage, power consumption
- Floor-by-floor breakdown with items and their positions
- Item specifications (volume, mass, power, noise)

---

### 3. `getAvailableItems`

**File:** `get-available-items.ts`

Get the list of available items that can be placed in the lunar base.

**When to use:**

- User asks what items are available or what equipment they can use
- Fourth step in "Fix with AI" workflow (to find solutions)
- Exploring options for base expansion

**Parameters:**

- `type` (optional): Filter by item type
  - Options: `command`, `crew`, `life-support`, `airlock`, `medical`, `galley`, `storage`, `utility`, `infrastructure`, `all`

**Returns:**

- Summary of available items count
- Items grouped by type
- Detailed item information (title, description, specs, notes)

---

### 4. `proposeLayoutChanges`

**File:** `propose-layout-changes.ts`

Propose specific changes to the lunar base layout that users can review and apply.

**When to use:**

- Fifth step in "Fix with AI" workflow (after analyzing and finding solutions)
- When the LLM has determined specific changes to fix identified problems
- To provide actionable, implementable solutions

**Parameters:**

- `explanation` (required, string): Clear explanation of why these changes solve the problems
- `changes` (required, array): Array of change objects with:
  - `action`: "add", "remove", "move", or "modify"
  - `itemTitle`: Name of the item being changed
  - `floorLevel`: Floor number where change occurs
  - `currentPosition`: {x, y, z} for move/remove actions (optional)
  - `newPosition`: {x, y, z} for add/move actions (optional)
  - `itemType`: Type of item for add actions (optional)
  - `reason`: Specific reason for this change

**Returns:**

- Success status
- Explanation and list of changes
- User sees special UI with "Apply Changes" button

**UI Behavior:**

- Displays as green accordion with ✨ icon
- Shows explanation and detailed change list
- Apply button updates the scene manager store
- Confirmation dialog before applying

---

## "Fix with AI" Workflow

The recommended workflow for problem-solving:

1. **getAISuggestions** - Understand what problems exist
2. **getHubLayout** - See the current base configuration
3. **Analyze** - Compare suggestions with actual layout
4. **getAvailableItems** (if needed) - Find items that could solve the problem
5. **proposeLayoutChanges** - Suggest specific, implementable changes with positions
6. **Provide text summary** - Brief explanation after proposing changes

### Special Rules for Invalid Item Placements

When encountering "Invalid Item Placement" errors (items on floors that don't accept their type):

- ❌ **DO NOT** suggest moving the item to another floor
- ✅ **DO** suggest removing the item
- **Reason:** Invalid placements indicate a design constraint violation that should be corrected by removal, not relocation

## Adding New Tools

To add a new tool:

1. Create a new file in this directory (e.g., `get-my-tool.ts`)
2. Export a function that returns a `tool()` definition
3. Add the export to `index.ts`
4. Update the chat API to include the tool
5. Update the frontend to pass required data
6. Update this README

## Types

All tools use proper TypeScript types from the stores:

- `Suggestion` from `stores/ai-suggestions.ts`
- `Hub`, `Floor`, `Item` from `stores/scene-manager.ts`
