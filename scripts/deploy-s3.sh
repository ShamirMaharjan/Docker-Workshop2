#!/bin/bash
set -euo pipefail

echo "Syncing $DIST_DIR to s3://$BUCKET ..."
aws s3 sync "$DIST_DIR" "s3://$BUCKET" --delete

echo "Deploy complete."