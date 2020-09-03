import { Platform } from '@mornya/platform-libs';

/* (참고용) Platform.getInfo(navigator.userAgent)
 * {
 *   // OS 벤더 구분
 *   OS: {
 *     vendor: string; // 'AOS' | 'IOS' | 'WOS' | 'WIN' | 'MAC' | 'LINUX';
 *     version: string; // version (semver)
 *   };
 *   // 브라우저(웹/앱) 구분
 *   Browser: {
 *     type: string; // 'APP' | 'MWEB' | 'PC';
 *     vendor: string; // 'WMP' | 'WSP' | 'CHROME' | 'SAFARI' | 'FIREFOX' | 'OPERA' | 'IE';
 *     version: string; // version (semver)
 *   };
 *   // UserAgent 정보
 *   UA: {
 *     productName: string; // (required)
 *     productVersion: string; // (required)
 *     systemInfo: string; // (required)
 *     extras?: string; // (optional)
 *   };
 *   isDesktop: boolean; // 데스크탑 PC에서의 브라우징 여부
 *   isMobile: boolean; // 모바일에서의 브라우징 여부 (네이티브 앱 일때에도 true)
 *   isMobileApp: boolean; // 네이티브 앱 여부 (WMP, WSP 등)
 *   isAOS: boolean; // OS가 Android인지 여부
 *   isIOS: boolean; // OS가 iOS인지 여부
 * }
 */
export const info = Platform.getInfo(navigator.userAgent);

// 서비스 지원불가 플랫폼
export const isNotSupported = (
  (
    // iOS <11.0 미지원
    info.isIOS && Platform.checkVersion('11.0.0', info.Browser.version) < 0
  ) ||
  (
    // Android <4.4.0 미지원
    info.isAOS && Platform.checkVersion('4.4.0', info.Browser.version) < 0
  ) ||
  (
    // PC IE10 미만 미지원
    info.isDesktop &&
    info.Browser.vendor === 'IE' &&
    Platform.checkVersion('10.0.0', info.Browser.version) < 0
  ) ||
  (
    // 윈도우OS 사파리 미지원
    info.OS.vendor === 'WIN' && info.Browser.vendor === 'SAFARI'
  )
);

// IE10,11 여부
export const isMSIE = (
  info.isDesktop &&
  info.Browser.vendor === 'IE' &&
  Platform.checkVersion('10.0.0', info.Browser.version) >= 0
);
