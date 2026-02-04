#!/bin/bash
# Lenny Antimemes Processing Loop
# Runs Claude Code CLI to process transcripts one at a time
#
# Usage: ./loop.sh [iterations]
# Example: ./loop.sh 10   # Process 10 episodes
#          ./loop.sh      # Process 1 episode (default)

set -e

# Configuration
PROJECT_DIR="/Users/calum/Library/Mobile Documents/iCloud~md~obsidian/Documents/Claude Projects/Projects/Lenny-Antimemes"
PROMPT_FILE="$PROJECT_DIR/prompts/process-transcript.md"
LOG_FILE="$PROJECT_DIR/processing.log"

# Number of iterations (default: 1)
ITERATIONS=${1:-1}

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎙️  Lenny Antimemes Processing"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Iterations: $ITERATIONS"
echo "Started: $(date)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Log start
echo "=== Processing started: $(date) ===" >> "$LOG_FILE"

for ((i=1; i<=$ITERATIONS; i++)); do
  echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${YELLOW}Iteration $i of $ITERATIONS${NC}"
  echo "$(date)"
  echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo ""

  # Run Claude Code with the processing prompt
  # Using -p for print mode (non-interactive)
  # The prompt file contains all instructions
  result=$(cd "$PROJECT_DIR" && claude -p "@prompts/process-transcript.md" 2>&1)

  # Log the result
  echo "--- Iteration $i: $(date) ---" >> "$LOG_FILE"
  echo "$result" >> "$LOG_FILE"
  echo "" >> "$LOG_FILE"

  # Print result
  echo "$result"
  echo ""

  # Check for completion signals
  if [[ "$result" == *"<done>ALL_COMPLETE</done>"* ]]; then
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}✅ All transcripts processed!${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo "=== All complete: $(date) ===" >> "$LOG_FILE"
    exit 0
  fi

  if [[ "$result" == *"<done>COMPLETE</done>"* ]]; then
    echo -e "${GREEN}✓ Episode processed successfully${NC}"
  else
    echo -e "${RED}⚠ Unexpected result (no completion signal)${NC}"
  fi

  echo ""

  # Small delay between iterations to avoid rate limiting
  if [ $i -lt $ITERATIONS ]; then
    echo "Waiting 5 seconds before next iteration..."
    sleep 5
  fi
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "⏰ Reached iteration limit ($ITERATIONS)"
echo "Finished: $(date)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "=== Finished (limit): $(date) ===" >> "$LOG_FILE"
