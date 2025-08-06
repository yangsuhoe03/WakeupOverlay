FROM ubuntu:22.04

# 필수 패키지 설치
RUN apt-get update && apt-get install -y \
    curl wget unzip git openjdk-17-jdk nodejs npm python3 \
    && apt-get clean

# Node.js 버전 설정 (20.x)
RUN npm install -g n && n 20.9.0

# Android SDK 설치
ENV ANDROID_SDK_ROOT /opt/android-sdk
RUN mkdir -p ${ANDROID_SDK_ROOT} && cd ${ANDROID_SDK_ROOT} \
    && curl -o sdk.zip https://dl.google.com/android/repository/commandlinetools-linux-10406996_latest.zip \
    && unzip sdk.zip -d cmdline-tools && rm sdk.zip \
    && mv cmdline-tools cmdline-tools-tools \
    && mkdir cmdline-tools && mv cmdline-tools-tools cmdline-tools/latest

ENV PATH "$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:$ANDROID_SDK_ROOT/platform-tools:$PATH"

# Android SDK 구성
RUN yes | sdkmanager --licenses
RUN sdkmanager "platform-tools" "build-tools;34.0.0" "platforms;android-34"

# 앱 파일 복사
WORKDIR /app
COPY . /app

# 패키지 설치
RUN npm install

# Metro Bundler 포트
EXPOSE 8081

CMD ["npx", "react-native", "start"]
