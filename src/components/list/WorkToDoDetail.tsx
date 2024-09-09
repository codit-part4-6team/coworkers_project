import { useRef } from 'react';
import XIcon from '@/assets/x.svg';
import KebabIcon from '@/assets/kebab_large.svg';
import ProfileMemberIcon from '@/assets/profile_member_large.svg';
import EnterIcon from '@/assets/enter.svg';
import EnterActiveIcon from '@/assets/enter_active.svg';
import CalendarNRepeat from './CalendarNRepeat';
import Dropdown, { DropdownOption } from '@/components/common/Dropdown';
import Button from '@/components/common/Button';
import FloatingButton from '@/components/common/FloatingButton';

const WorkToDoOptions: DropdownOption[] = [
  { label: '수정하기', value: 'edit' },
  { label: '삭제하기', value: 'delete' },
];

export default function WorkToDoDetail() {
  const commentRef = useRef<HTMLTextAreaElement>(null);

  const handleResizeHeight = () => {
    if (commentRef.current) {
      commentRef.current.style.height = 'auto';
      commentRef.current.style.height = commentRef.current.scrollHeight + 'px';
    }
  };

  const handleWorkToDoOptionChange = (option: DropdownOption) => {
    console.log('dasd');
  };

  return (
    <div className="fixed top-[60px] right-0 z-10 p-4 md:p-6 lg:p-10 w-[100%] md:w-[434px] lg:w-[780px] h-svh md:border-l-[1px] md:border-solid md:border-border-primary-10 bg-background-secondary">
      <button type="button" className="mb-4">
        <XIcon />
      </button>
      <div className="flex justify-between items-start mb-3 md:mb-4">
        <h4 className="text-2lg md:text-xl font-bold">
          법인 설립 비용 안내 드리기
        </h4>
        <Dropdown
          options={WorkToDoOptions}
          customButton={<KebabIcon />}
          onChange={handleWorkToDoOptionChange}
          size="md"
        />
      </div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <ProfileMemberIcon />
          <span className="text-md font-medium">안해나</span>
        </div>
        <span className="text-md font-regular text-text-secondary">
          2025.05.30
        </span>
      </div>
      <div className="mb-6">
        <CalendarNRepeat />
      </div>
      <p className="mb-[100px] md:mb-[182px]">
        필수 정보 10분 입력하면 3일 안에 법인 설립이 완료되는 법인 설립 서비스의
        장점에 대해 상세하게 설명드리기
      </p>
      <div className="flex justify-between items-start mb-6 py-[13px] border-y-[1px] border-border-primary-10">
        <label htmlFor="comment" className="hidden">
          comment
        </label>
        <textarea
          ref={commentRef}
          rows={1}
          placeholder="댓글을 달아주세요"
          onChange={handleResizeHeight}
          className="w-full h-6 pt-[3px] text-md font-regular bg-background-secondary overflow-y-hidden outline-none resize-none placeholder:text-md placeholder:font-regular placeholder:text-text-default"
        />
        <button type="button">
          <EnterIcon />
          {/* <EnterActiveIcon /> */}
        </button>
      </div>
      <div className="flex flex-col gap-4 pb-4 border-b-[1px] border-border-primary-10">
        <div className="flex justify-between items-start">
          <p className="text-md font-regular">
            법인 설립 서비스 관련 링크 첨부 드려요 https://www.codeit.kr
            아아아고고고라라라니니니 링크 첨부 부탇 아아아고고고라라라니니니
            링크 첨부 부탇 아아아고고고라라라니니니 링크 첨부
            부탇아아고고고라라라니니니 링크 첨부 부탇 아아아고고고라라라니니니
            링크 첨부 부탇아아고고고라라라니니니 링크 첨부 부탇
            아아아고고고라라라니니니 링크 첨부 부탇
          </p>
          <Dropdown
            options={WorkToDoOptions}
            customButton={<KebabIcon />}
            onChange={handleWorkToDoOptionChange}
            size="md"
          />
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <ProfileMemberIcon />
            <span className="text-md font-medium">우지은</span>
          </div>
          <span className="text-md font-regular text-text-secondary">
            2025.05.30
          </span>
        </div>
        <div className="flex justify-end items-center gap-2">
          <button
            type="button"
            className="w-12 h-8 text-md font-semibold text-text-default hover:text-[rgba(100, 116, 139, 0.5)] active:text-text-secondary"
          >
            취소
          </button>
          <Button
            option="outlined"
            size="xsmall"
            text="수정하기"
            blank={true}
          />
        </div>
      </div>
      <div className="fixed right-4 bottom-6 md:right-6 md:bottom-5 lg:right-10 lg:bottom-10">
        <FloatingButton option="success" text="완료하기" disabled={false} />
        {/* <FloatingButton option="cancel" text="완료 취소하기" disabled={false} /> */}
      </div>
    </div>
  );
}