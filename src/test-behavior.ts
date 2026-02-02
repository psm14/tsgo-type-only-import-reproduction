/**
 * Test that demonstrates the behavioral difference between tsc and tsgo.
 *
 * Run with: node dist-tsc/test-behavior.js
 *       vs: node dist-tsgo/src/test-behavior.js
 *
 * Expected output:
 *
 * tsc:
 *   Starting test...
 *   Importing consumer module...
 *   Consumer module loaded successfully
 *   (No "[SIDE EFFECT]" message - provider was correctly not loaded)
 *
 * tsgo:
 *   Starting test...
 *   Importing consumer module...
 *   [SIDE EFFECT] provider.ts module loaded    <-- UNEXPECTED!
 *   Consumer module loaded successfully
 *
 * The presence or absence of the "[SIDE EFFECT]" message shows whether
 * the provider module was loaded. It should NOT be loaded because
 * the consumer only uses Amount in type positions.
 */

console.log("Starting test...");
console.log("Importing consumer module...");

// Import the consumer module - this will trigger the side effect
// if the provider module is required
import("./consumer")
  .then(() => {
    console.log("Consumer module loaded successfully");
    console.log("");
    console.log('If you saw "[SIDE EFFECT] provider.ts module loaded" above,');
    console.log("then the import was NOT elided.");
    console.log("");
    console.log("If you did NOT see that message,");
    console.log("then the import WAS elided.");
  })
  .catch((err: unknown) => {
    console.error("Error:", err);
  });
