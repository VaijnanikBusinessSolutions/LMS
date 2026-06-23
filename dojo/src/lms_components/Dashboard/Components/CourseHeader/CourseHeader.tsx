
import { BookOpen, Award } from 'lucide-react';

export default function CourseHeader() {
  return (
    <div className="bg-surface p-8 rounded-3xl border border-border shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-text mb-2">
            Welcome back, <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Student!</span>
          </h1>
          <p className="text-muted text-base font-medium">Continue your learning journey</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3 px-5 py-3 bg-background rounded-2xl border border-border shadow-sm">
            <div className="p-2 bg-orange-50 rounded-xl">
              <BookOpen size={20} className="text-orange-500" />
            </div>
            <div>
              <span className="block text-xs font-bold text-muted uppercase tracking-wide">Enrolled</span>
              <span className="text-text font-bold text-lg">12 Courses</span>
            </div>
          </div>
          <div className="flex items-center gap-3 px-5 py-3 bg-background rounded-2xl border border-border shadow-sm">
            <div className="p-2 bg-green-50 rounded-xl">
              <Award size={20} className="text-green-500" />
            </div>
            <div>
              <span className="block text-xs font-bold text-muted uppercase tracking-wide">Finished</span>
              <span className="text-text font-bold text-lg">4 Completed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}