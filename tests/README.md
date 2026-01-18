# Playwright E2E Tests for Aestimo

This directory contains comprehensive end-to-end tests for the Aestimo planning poker application using Playwright.

## Test Structure

```
tests/
├── fixtures/
│   ├── page-objects.ts    # Page Object Models for UI interactions
│   └── test-data.ts       # Test data and constants
└── e2e/
    ├── room-creation.spec.ts      # Tests for room creation functionality
    ├── room-joining.spec.ts       # Tests for joining existing rooms
    ├── voting.spec.ts             # Tests for voting in rooms
    ├── reveal-results.spec.ts     # Tests for revealing vote results
    └── complete-flow.spec.ts      # Full workflow integration tests
```

## Running Tests

### Install Dependencies
```bash
npm install
npx playwright install
```

### Run All Tests
```bash
npm run test:e2e
```

### Run Tests in UI Mode
```bash
npm run test:e2e:ui
```

### Run Tests in Headed Mode
```bash
npm run test:e2e:headed
```

### Run Specific Test Files
```bash
npx playwright test tests/e2e/room-creation.spec.ts
npx playwright test tests/e2e/voting.spec.ts
```

### Run Tests for Specific Browsers
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## Test Coverage

### 1. Room Creation (`room-creation.spec.ts`)
- ✅ Create public Fibonacci room
- ✅ Create T-shirt sizing room
- ✅ Create private room with custom prefix
- ✅ Form validation
- ✅ URL structure verification
- ✅ Admin privileges verification
- ✅ Room information display
- ✅ Support for multiple vote types

### 2. Room Joining (`room-joining.spec.ts`)
- ✅ Join room from new page
- ✅ Join room directly via URL
- ✅ Username validation
- ✅ Regular user privileges
- ✅ Vote options display
- ✅ Multiple users joining same room
- ✅ Room not found handling
- ✅ Session persistence

### 3. Voting (`voting.spec.ts`)
- ✅ Select and change votes
- ✅ User vote status updates
- ✅ Multiple users voting
- ✅ T-shirt sizing votes
- ✅ Vote persistence during refresh
- ✅ All Fibonacci vote values
- ✅ Visual feedback for selected votes
- ✅ Rapid vote changes

### 4. Revealing Results (`reveal-results.spec.ts`)
- ✅ Admin reveal functionality
- ✅ Non-admin restrictions
- ✅ Multi-user reveal visibility
- ✅ Next round progression
- ✅ Current round restart
- ✅ T-shirt room reveal
- ✅ Auto-reveal detection
- ✅ Empty room handling

### 5. Complete Flow (`complete-flow.spec.ts`)
- ✅ Full workflow with multiple users
- ✅ T-shirt sizing workflow
- ✅ Private room workflow
- ✅ User disconnection/reconnection
- ✅ Stress testing with many users

## Features Tested

### Core Functionality
- Room creation (public, private, custom prefix)
- Room joining and session management
- Voting with Fibonacci and T-shirt sizes
- Vote revealing and result display
- Round management (next, restart)
- Admin vs user privilege separation

### Edge Cases
- Form validation
- Room not found scenarios
- User disconnection/reconnection
- Empty rooms
- Rapid interactions

### Multi-User Scenarios
- Concurrent voting
- Real-time updates
- Session isolation
- Cross-browser compatibility

## Configuration

### Browser Support
- ✅ Chromium (Chrome)
- ✅ Firefox
- ✅ WebKit (Safari)
- ✅ Mobile Chrome
- ✅ Mobile Safari

### Test Settings
- ✅ Parallel test execution
- ✅ Retry on CI
- ✅ Screenshot on failure
- ✅ Video recording on failure
- ✅ Trace recording on retry
- ✅ Automatic dev server startup

## Data-Driven Testing

The tests use structured test data in `test-data.ts`:

```typescript
export const TEST_DATA = {
  rooms: {
    fibonacci: { name: 'Test Fibonacci Room', voteType: 'fibonacci' },
    tshirt: { name: 'Test T-Shirt Room', voteType: 'tshirt' },
    privateRoom: { name: 'Test Private Room', private: true }
  },
  users: {
    creator: 'TestCreator',
    voter1: 'VoterOne',
    voter2: 'VoterTwo'
  },
  votes: {
    fibonacci: ['1', '2', '3', '5', '8', '13', '21', '34', '55', '89'],
    tshirt: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  }
};
```

## Page Object Models

The `page-objects.ts` file provides reusable classes for UI interactions:

- `HomePage` - Navigation and homepage actions
- `NewRoomPage` - Room creation form handling
- `JoinRoomPage` - Room joining form handling
- `RoomPage` - Voting and result display interactions

## Best Practices Implemented

1. **Page Object Pattern** - Separation of test logic from UI interactions
2. **Test Data Management** - Centralized test data for maintainability
3. **Multi-Context Testing** - Isolated browser contexts for independent sessions
4. **Assertion Libraries** - Playwright's built-in expect assertions
5. **Error Handling** - Graceful handling of edge cases and errors
6. **Cross-Browser Testing** - Tests run on all major browsers
7. **Mobile Testing** - Responsive design testing on mobile viewports

## Running Individual Test Scenarios

### Quick smoke test:
```bash
npx playwright test --grep "should create a public Fibonacci room"
```

### Full workflow test:
```bash
npx playwright test tests/e2e/complete-flow.spec.ts
```

### Mobile testing:
```bash
npx playwright test --project="Mobile Chrome"
```

## Debugging Failed Tests

1. Open HTML report: `npx playwright show-report`
2. Run with trace viewer: `npx playwright test --trace on`
3. Debug with browser: `npm run test:e2e:debug`

## CI/CD Integration

The tests are configured for CI environments:
- Automatic browser installation
- Parallel execution for speed
- Retry mechanisms for flaky tests
- Detailed reporting and artifacts

## Contributing

When adding new tests:
1. Use existing page object methods when possible
2. Add new test data to `test-data.ts`
3. Follow the existing naming conventions
4. Include both positive and negative test cases
5. Test on multiple browsers when applicable