import Shell from '@/components/layout/Shell';
import QuizStepper from '@/components/quiz/QuizStepper';

export default function DegerlendirmePage() {
  return (
    <Shell>
      <div className="py-8 fade-in">
        <h1 className="text-2xl font-bold text-center mb-8">Yetenek Degerlendirmesi</h1>
        <QuizStepper />
      </div>
    </Shell>
  );
}
