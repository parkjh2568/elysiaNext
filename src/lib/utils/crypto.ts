import { Ddu64 } from '@ddunigma/node';

// 환경변수에서 암호화 키 가져오기 (fallback 키 제공)
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'default-secret-key-32-characters!!';
const TOWNCAR_DDU_SECRET="qw74QW7ETefgtnkoY6UIOPZXCVBNMerrtyASDwdfghumJDGEUISO9AKXMCBnbvffeqsFGHJpkcnmxjshqiowpejtnrjcKLuioplkjhgfdsazxcvbnm"
const TOWNCAR_DDU_PADDING="R"
// Ddu64 인스턴스 생성 (암호화용)
const ddu64 = new Ddu64(TOWNCAR_DDU_SECRET, TOWNCAR_DDU_PADDING);

export interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  refreshExpiresAt: number;
}

/**
 * 데이터를 안전하게 인코딩
 */
const safeEncode = (data: any): string => {
  try {
    // 1. JSON 문자열로 변환
    const jsonString = JSON.stringify(data);
    
    // 2. Base64로 인코딩하여 특수문자 문제 해결
    const base64Data = Buffer.from(jsonString, 'utf-8').toString('base64');
    
    // 3. 키와 함께 결합 (구분자 사용)
    const combinedData = `${ENCRYPTION_KEY}:${base64Data}`;
    
    // 4. ddunigma/node로 최종 인코딩
    const encoded = ddu64.encode(combinedData, {usePowerOfTwo: true});
    
    return encoded;
  } catch (error) {
    console.error('Safe encode error:', error);
    throw new Error('데이터 인코딩에 실패했습니다.');
  }
};

/**
 * 데이터를 안전하게 디코딩
 */
const safeDecode = (encodedData: string): any => {
  try {
    // 1. ddunigma/node로 디코딩
    const decoded = ddu64.decode(encodedData, {usePowerOfTwo: true});
    
    // 2. 키와 데이터 분리 (구분자 기준)
    const separator = ':';
    const separatorIndex = decoded.indexOf(separator);
    
    if (separatorIndex === -1) {
      throw new Error('잘못된 데이터 형식입니다.');
    }
    
    const extractedKey = decoded.substring(0, separatorIndex);
    const base64Data = decoded.substring(separatorIndex + 1);
    
    // 3. 키 검증
    if (extractedKey !== ENCRYPTION_KEY) {
      throw new Error('키가 일치하지 않습니다.');
    }
    
    // 4. Base64 디코딩
    const jsonString = Buffer.from(base64Data, 'base64').toString('utf-8');
    
    // 5. JSON 파싱
    const data = JSON.parse(jsonString);
    
    return data;
  } catch (error) {
    console.error('Safe decode error:', error);
    throw error;
  }
};

/**
 * 토큰 데이터를 암호화하여 문자열로 반환
 */
export const encryptToken = (tokenData: TokenData): string => {
  try {
    return safeEncode(tokenData);
  } catch (error) {
    console.error('토큰 암호화 오류:', error);
    throw new Error('토큰 암호화에 실패했습니다.');
  }
};

/**
 * 암호화된 토큰 문자열을 복호화하여 TokenData 반환
 */
export const decryptToken = (encryptedToken: string): TokenData | null => {
  try {
    const tokenData = safeDecode(encryptedToken) as TokenData;
    return tokenData;
  } catch (error) {
    console.error('토큰 복호화 오류:', error);
    return null;
  }
};

/**
 * 사용자 정보를 암호화하여 문자열로 반환
 */
export const encryptUserData = (userData: any): string => {
  try {
    return safeEncode(userData);
  } catch (error) {
    console.error('사용자 데이터 암호화 오류:', error);
    throw new Error('사용자 데이터 암호화에 실패했습니다.');
  }
};

/**
 * 암호화된 사용자 정보를 복호화
 */
export const decryptUserData = (encryptedUserData: string): any | null => {
  try {
    const userData = safeDecode(encryptedUserData);
    return userData;
  } catch (error) {
    console.error('사용자 데이터 복호화 오류:', error);
    return null;
  }
};

/**
 * Access Token이 만료되었는지 확인
 */
export const isAccessTokenExpired = (tokenData: TokenData): boolean => {
  return Date.now() >= tokenData.expiresAt;
};

/**
 * Refresh Token이 만료되었는지 확인
 */
export const isRefreshTokenExpired = (tokenData: TokenData): boolean => {
  return Date.now() >= tokenData.refreshExpiresAt;
}; 