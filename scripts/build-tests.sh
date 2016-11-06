#!/bin/bash
if [[ $TRAVIS ]]; then
  CONFIGURATION=Release
else
  CONFIGURATION=Debug
fi;

# # iOS
# echo "***** Building iOS $CONFIGURATION configuration *****"
# xcodebuild \
#   -project ios/ReactNativeTest.xcodeproj \
#   -scheme ReactNativeTest GCC_PREPROCESSOR_DEFINITIONS='$GCC_PREPROCESSOR_DEFINITIONS TEST=1'\
#   -configuration $CONFIGURATION \
#   -destination "platform=iOS Simulator,OS=$IOS_VERSION,name=$DEVICE_NAME" \
#   -derivedDataPath ios/build

# ANDROID
echo "***** Building Android $CONFIGURATION configuration *****"
cd android && ./gradlew assembleDebug
