import Shell from '@/components/layout/Shell';
import ProfileForm from '@/components/profile/ProfileForm';

export default function OlusturPage() {
  return (
    <Shell>
      <div className="py-8 fade-in">
        <ProfileForm />
      </div>
    </Shell>
  );
}
