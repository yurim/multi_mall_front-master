export default {
  objectToUrlParams(object, prefix) {
    const query = Object.keys(object).map((key) => {
      const value = object[key];

      if (object.constructor === Array) {
        key = `${prefix}[]`;
      } else if (object.constructor === Object) {
        key = (prefix ? `${prefix}[${key}]` : key);
      }

      if (typeof value === 'object') {
        return this.objectToUrlParams(value, key);
      }
      return `${key}=${encodeURIComponent(value)}`;
    });

    return [].concat(...query).join('&');
  },
  // lpad function
  // ex) util.lpad('11',4,'0'); -> 0011
  lpad(string, length, paddingString) {
    let result = string.toString();
    const size = length - result.length;

    for (let i = 0; i < size; i += 1) {
      result = paddingString + result;
    }

    return result;
  },
  // rpad function
  // ex) util.rpad('11',4,'0'); -> 1100
  rpad(string, length, paddingString) {
    let result = string.toString();
    const size = length - result.length;

    for (let i = 0; i < size; i += 1) {
      result += paddingString;
    }

    return result;
  },

  strByteLength(s, b, i, c) {
    // eslint-disable-next-line no-multi-assign,no-cond-assign,no-plusplus,no-bitwise,no-nested-ternary
    for (b = i = 0; c = s.charCodeAt(i++); b += c >> 11 ? 3 : c >> 7 ? 2 : 1);
    return b;
  },
  checkMongoDBObjectId(objectId) {
    const objectIdStr = objectId.toString();
    const len = objectIdStr.length;
    let valid = false;
    if (len === 12 || len === 24) {
      valid = /^[0-9a-fA-F]+$/.test(objectIdStr);
    }
    return valid;
  },
  showSearchAddress(callback) {
    // eslint-disable-next-line no-undef
    new daum.Postcode({
      width: 500,
      height: 600,
      oncomplete: (data) => {
        const addressData = {};
        addressData.zonecode = data.zonecode;
        addressData.sigungu_code = data.sigunguCode;
        if (data.userSelectedType === 'R') addressData.address = data.roadAddress;
        if (data.userSelectedType === 'J') addressData.address = data.jibunAddress;
        if (callback) callback(addressData);
      },
    }).open({
      popupName: 'postcodePopup',
    });
  },
  replaceAll(string, regex, replaceTo) {
    return string.replace(new RegExp(regex, 'g'), replaceTo);
  },
  // 정규식 관련 정의
  regularExpression: {
    // eslint-disable-next-line
    email: /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/,
    phone: /^(0(\d{1,3}))-(\d{3,4})-(\d{4})$/,
    phoneNoDash: /^(0(\d{1,3}))(\d{3,4})(\d{4})$/,
    date: /^(\d{4})-(\d{2})-(\d{2})$/,
    id: /^[a-z0-9_-]{4,20}$/,
    pwd: /^[A-Za-z0-9_-`~!@#$%^&*|\\;:?]{8,16}$/,
    number: /^[0-9]{0,10}$/,
    hanNumEng: /^[ㄱ-ㅎ|가-힣|ㅏ-ㅣ|a-z|A-Z|0-9|\u119E|\u11A2]+$/,
    hanNumEngSpace: /^[ㄱ-ㅎ|가-힣|ㅏ-ㅣ|a-z|A-Z|0-9|\u119E|\u11A2]+$/,
    base64: /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/,
    completeKorean: /^[((\uac00-\ud7a3)|(\u0020)|(A-Za-z0-9))+]*$/,
    // eslint-disable-next-line
    url: /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/,
    licenseNum: /(\d{3})-(\d{2})-(\d{5})/, // 사업자 등록번호
    imageFile: /image\/.*/,
  },
  // 정규식 유효성 체크
  // util.checkRegularExpression('비밀번호값', util.regularExpression.pwd)
  checkRegularExpression(string, regex) {
    return regex.test(string);
  },
  // async for loop
  async asyncFor(length, callback) {
    for (let index = 0; index < length; index += 1) {
      if (callback) {
        // eslint-disable-next-line
        const flag = await callback(index);
        if (!flag) {
          break;
        }
      } else {
        break;
      }
    }
  },
  // async forEach loop
  async asyncForEach(array, callback) {
    if (array && array.length > 0) {
      for (let index = 0; index < array.length; index += 1) {
        if (callback) {
          // eslint-disable-next-line
          const flag = await callback(array[index], index, array);
          if (!flag) {
            break;
          }
        } else {
          break;
        }
      }
    }
  },
};
