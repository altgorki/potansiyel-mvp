import Shell from '@/components/layout/Shell';
import InterestSelector from '@/components/profile/InterestSelector';

export default function IlgiAlanlariPage() {
  return (
    <Shell>
      <div className="py-8 fade-in">
        <InterestSelector />
      </div>
    </Shell>
  );
}
