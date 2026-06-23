import { MoreVertical, BookOpen, FileText, CheckCircle2 } from 'lucide-react';

interface CourseRowProps {
  course: {
    id: number;
    name: string;
    progress: number;
    lessons: number;
    assignments: number;
    tests: number;
    color: string;
    type: 'Current' | 'Completed' | 'Mandatory';
  };
  index: number;
}

const CourseRow = ({ course, index }: CourseRowProps) => {
  const getProgressColor = (progress: number) => {
    if (progress === 100) return 'bg-green-500';
    if (progress >= 50) return 'bg-purple-500';
    return 'bg-orange-500';
  };

  return (
    <tr className="border-b border-border hover:bg-background transition-colors group last:border-0">
      <td className="px-8 py-5 text-muted font-bold text-sm">
        {String(index + 1).padStart(2, '0')}
      </td>
      
      <td className="px-8 py-5">
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${course.color} shadow-sm`} />
          <span className="font-bold text-text text-sm">{course.name}</span>
        </div>
      </td>
      
      <td className="px-8 py-5">
        <div className="flex items-center gap-4 w-48">
          <div className="flex-1 h-2.5 bg-background border border-border rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${getProgressColor(course.progress)} shadow-sm transition-all duration-500 ease-out`}
              style={{ width: `${course.progress}%` }}
            />
          </div>
          <span className="text-text font-bold text-xs w-10">{course.progress}%</span>
        </div>
      </td>
      
      <td className="px-8 py-5">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-muted" title="Lessons">
            <BookOpen size={16} className="text-blue-500" />
            <span className="text-xs font-bold">{course.lessons}</span>
          </div>
          <div className="flex items-center gap-2 text-muted" title="Assignments">
            <FileText size={16} className="text-purple-500" />
            <span className="text-xs font-bold">{course.assignments}</span>
          </div>
          <div className="flex items-center gap-2 text-muted" title="Tests">
            <CheckCircle2 size={16} className="text-green-500" />
            <span className="text-xs font-bold">{course.tests}</span>
          </div>
        </div>
      </td>
      
      <td className="px-8 py-5 text-right">
        <button className="p-2 hover:bg-background border border-transparent hover:border-border rounded-xl text-muted hover:text-purple-600 transition-colors">
          <MoreVertical size={18} />
        </button>
      </td>
    </tr>
  );
};

export default CourseRow;