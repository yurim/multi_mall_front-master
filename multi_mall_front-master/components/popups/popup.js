import Example from './Example';
import Alert from './PopAlert';
import Confirm from './PopConfirm';
import Reason from './PopReason'; // 사유입력
import DeliveryFee from './PopDeliveryFee'; // 배송비
import ShowInformation from './PopShowInformation'; // 정보고시
import Benefit from './PopBenefit'; // 혜택선택
import Review from './PopReview'; // 상품리뷰
import InvoiceUpload from './PopInvoiceUpload'; // 송장 업로드
import InvoiceEdit from './PopInvoiceEdit'; // 송장정보 수정
import Memo from './PopMemo'; // 관리자 메모
import DelaysDelivery from './PopDelaysDelivery'; // 배송지연
import RequestReturn from './PopRequestReturn'; // 반품신청
import RequestReturnEdit from './PopRequestReturnEdit'; // 반품수정
import RequestReturnDetail from './PopRequestReturnDetail'; // 반품신청상세정보
import RequestExchange from './PopRequestExchange'; // 교환신청
import RequestExchangeEdit from './PopRequestExchangeEdit'; // 교환신청수정
import RequestExchangeDetail from './PopRequestExchangeDetail'; // 교환신청상세정보
import RequestCancel from './PopRequestCancel'; // 취소신청
import RequestCancelEdit from './PopRequestCancelEdit'; // 취소신청수정
import RequestCancelDetail from './PopRequestCancelDetail'; // 취소신청상세
import ProductPickup from './PopProductPickup'; // 수거처리 팝업(반품수거, 교환수거)
import RedeliveryExchange from './PopRedeliveryExchange'; // 교환 재배송 처리
import ExcelDownload from './PopExcelDownload';
import Inquiry from './PopInquiry'; // 상품문의
import UploadFile from './PopUploadFile'; // 엑셀 다운로드
import OrderDeliveryInfo from './PopOrderDeliveryInfo'; // 엑셀 다운로드
import ReturnToExchange from './PopReturnToExchange'; // 교환으로 변경
import ExchangeToReturn from './PopExchangeToReturn'; // 반품으로 변경
import RejectDeliveryReason from './PopRejectDeliveryReason'; // 교환 또는 반품 거부
import MountainousArea from './PopMountainousArea'; // 도서산간 주소지 정보
import Address from './PopAddress'; // 출고지 및 반품/교환지 주소 입력
import OptionImage from './PopOptionImage'; // 조합형 단독형 옵션이미지 변경
import OptionValue from './PopOptionValue'; // 조합형 단독형 옵션 변경
import DeliveryAlert from './PopDeliveryAlert'; // 배송비템플릿 경고
import Terms from './PopTerms'; // 유저 회원가입 약관
import LeaveReason from './PopLeaveReason'; // 회원 탈퇴 사유입력
import UserPoint from './PopUserPoint'; // 회원 현재포인트 수정
import DeliveryTemplate from './PopDeliveryTemplate'; // 배송비 템플릿 조회

import ReviewWrite from './PopReviewWrite'; // 리뷰작성
import AddressModify from './PopAddressModify'; // 배송지변경
import InquiryWrite from './PopInquiryWrite'; // 문의하기
import DeliveryInfo from './PopDeliveryInfo'; // 배송정보
import CouponList from './PopCouponList'; // 쿠폰목록, 쿠폰 선택
import ReviewShow from './PopReviewShow'; // 리뷰보기
import DeliveryAddressList from './PopDeliveryAddressList'; // 배송지 목록
import ShippingAddress from './PopShippingAddress'; // 배송지 등록
import ProductSelect from './PopProductSelect'; // 제품선택 팝업
import UserRegistCompleted from './PopUserRegistCompleted'; // 회원가입 완료 팝업
import NonMemberOrderConfirm from './PopNonMemberOrderConfirm';
import SummernoteEditor from './PopSummernoteEditor';
import TransferLinkage from './PopTransferLinkage'; // 외부 상품 연동 등록 팝업
import StoreInfo from './PopStoreInfo';
import Amazic9Courier from './PopAmazic9Courier'; // 배송대행 택배정보 보기 팝업
import Amazic9Request from './PopAmazic9Request'; // 배송대행 신청 팝업
import Amazic9PurchaseStatusAlert from './PopAmazic9PurchaseStatusAlert';
import UpdateOptionPrice from './PopUpdateOptionPrice'; // 옵션추가금액 적용 방식 변경 팝업
import RequestReturnFeePayMethodEdit from './PopRequestReturnFeePayMethodEdit';
import RequestExchangeFeePayMethodEdit from './PopRequestExchangeFeePayMethodEdit';
import DelayReason from './PopDelayReason';
import ResizeImage from './PopResizeImage';
import RecoverProduct from './PopRecoverProduct'; // 삭제상품조회
import Notice from './PopNotice';
import RefundPrice from './PopRefundPrice';
import St11Linkage from './PopSt11Linkage'; // 11번가 연동
import SelectDownloadExcelType from './PopSelectDownloadExcelType'; // 엑셀다운 선택/범위 팝업
import Progress from './PopProgress'; // 프로그레스 팝업
import ProgressBar from './PopProgressBar'; // 프로그레스 팝업
import AbroadReview from './PopAbroadReview';
import ProductCategoryEdit from './PopProductCategoryEdit';
import EventInfo from './PopEventInfo'; // 이벤트 공지 팝업

// 가격비교 팝업
import PriceGroupStorage from './PopPriceGroupStorage';
import PriceGroupCancellation from './PopPriceGroupCancellation';
import PriceGroupAddition from './PopPriceGroupAddition';

import PriceGroupConditionEdit from './PopPriceGroupConditionEdit';
import PriceGroupChange from './PopPriceGroupChange';

import PriceGroupImageSearch from './PopPriceGroupImageSearch';

require('./popup.scss');
require('./popup_user.scss');
require('./popup_product.scss');
require('@/assets/css/star_rate.scss');
// require('@/assets/css/user/variable.scss');
// require('@/assets/css/user/reset_button.scss');
// require('@/assets/css/user/reset_input.scss');

export default {
  showAlertPopup: (message, closeCallback = () => {}) => {
    new Alert({
      propsData: {
        title: message,
        okCallback: ({ $destroy }) => $destroy(),
        closeCallback,
      },
    }).$mount();
  },
  Example,
  Alert,
  Confirm,
  Reason,
  DeliveryFee,
  ShowInformation,
  Benefit,
  Review,
  AbroadReview,
  InvoiceUpload,
  InvoiceEdit,
  Memo,
  ShippingAddress,
  DelaysDelivery,
  RequestReturn,
  RequestReturnEdit,
  RequestReturnDetail,
  RequestExchange,
  RequestExchangeEdit,
  RequestExchangeDetail,
  RequestCancel,
  RequestCancelEdit,
  RequestCancelDetail,
  ProductPickup,
  RedeliveryExchange,
  ExcelDownload,
  Inquiry,
  UploadFile,
  OrderDeliveryInfo,
  ReturnToExchange,
  ExchangeToReturn,
  RejectDeliveryReason,
  MountainousArea,
  Address,
  OptionImage,
  OptionValue,
  DeliveryAlert,
  Terms,
  LeaveReason,
  UserPoint,
  ReviewWrite,
  AddressModify,
  InquiryWrite,
  DeliveryInfo,
  CouponList,
  ReviewShow,
  DeliveryAddressList,
  DeliveryTemplate,
  ProductSelect,
  UserRegistCompleted,
  NonMemberOrderConfirm,
  SummernoteEditor,
  TransferLinkage,
  StoreInfo,
  Amazic9Courier,
  Amazic9Request,
  Amazic9PurchaseStatusAlert,
  UpdateOptionPrice,
  RequestReturnFeePayMethodEdit,
  RequestExchangeFeePayMethodEdit,
  DelayReason,
  ResizeImage,
  RecoverProduct,
  Notice,
  RefundPrice,
  St11Linkage,
  SelectDownloadExcelType,
  Progress,
  ProgressBar,
  ProductCategoryEdit,
  PriceGroupStorage,
  PriceGroupCancellation,
  PriceGroupAddition,
  PriceGroupConditionEdit,
  PriceGroupChange,
  PriceGroupImageSearch,
  EventInfo,
};
