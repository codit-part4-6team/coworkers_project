import Gear from '@/assets/gear.svg';
import thumbnail from '@/assets/thumbnail_team.png';
import Dropdown, { DropdownOption } from '@/components/common/Dropdown';
import { useRouter } from 'next/router';

interface GroupHeaderProps {
  groupName: string;
  groupId: number;
}

const GroupHeader = ({ groupName, groupId }: GroupHeaderProps) => {
  const router = useRouter();

  const teamOptions: DropdownOption[] = [
    { label: '수정하기', value: 'edit' },
    { label: '삭제하기', value: 'delete' },
  ];

  const handleOptionChange = (option: DropdownOption) => {
    if (option.value === 'edit') {
      router.push(`/group/${groupId}/edit`);
    }
  };

  return (
    <div
      className="px-6 py-5 bg-background-secondary rounded-xl shadow-md border border-border-primary-10 mb-6 mt-2"
      style={{
        backgroundImage: `url(${thumbnail.src})`,
        backgroundPosition: 'center right 80px',
        backgroundSize: 'auto 100%',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="relative z-10">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-white">{groupName}</h1>
          <Dropdown
            options={teamOptions}
            onChange={handleOptionChange}
            customButton={<Gear />}
            size="md"
          />
        </div>
      </div>
    </div>
  );
};

export default GroupHeader;
