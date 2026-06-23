import { BookOpen, UserCheck, GraduationCap } from 'lucide-react';
import { useState } from 'react';
import type{ Course, Group, User } from '../Types/Types'; // Assuming these types are defined

interface GroupFormProps {
  initialData?: Group;
  onSubmit: (data: { name: string; teachers: User[]; students: User[]; courses: Course[] }) => void;
  onCancel: () => void;
  availableUsers: User[];
  availableCourses: Course[];
  submitButtonText: string;
}

export const GroupForm = ({
  initialData,
  onSubmit,
  onCancel,
  availableUsers,
  availableCourses,
  submitButtonText,
}: GroupFormProps) => {
  const [groupName, setGroupName] = useState(initialData?.name || '');
  const [selectedTeachers, setSelectedTeachers] = useState<User[]>(initialData?.teachers || []);
  const [selectedStudents, setSelectedStudents] = useState<User[]>(initialData?.students || []);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>(initialData?.assignedCourses || []);

  const teamLeaders = availableUsers.filter(user => user.role === 'Team Leader');
  const employees = availableUsers.filter(user => user.role === 'Employee');

  const handleSubmit = () => {
    if (!groupName.trim()) {
        alert("Please provide a group name.");
        return;
    }

    onSubmit({
      name: groupName,
      teachers: selectedTeachers,
      students: selectedStudents,
      courses: selectedCourses
    });
  };

  const toggleUser = (user: User, list: User[], setList: React.Dispatch<React.SetStateAction<User[]>>) => {
    setList(prev =>
      prev.some(u => u.id === user.id)
        ? prev.filter(u => u.id !== user.id)
        : [...prev, user]
    );
  };
  
  const toggleCourse = (course: Course) => {
    setSelectedCourses(prev =>
      prev.some(c => c.id === course.id)
        ? prev.filter(c => c.id !== course.id)
        : [...prev, course]
    );
  };

  return (
    <div className="p-6 space-y-6 bg-surface text-text rounded-xl border border-border shadow-sm">
      {/* Group Name Input */}
      <div>
        <label className="block text-sm font-medium text-muted mb-2">
          Group Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="w-full px-4 py-2 bg-background border border-border rounded-lg text-text placeholder-muted focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          placeholder="e.g. 'Backend Engineering'"
          required
        />
      </div>

      {/* Selections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Team Leaders Selection */}
        <div>
          <label className="block text-sm font-medium text-muted mb-2 flex items-center gap-2">
            <UserCheck size={16} className="text-blue-600" />
            Team Leaders ({selectedTeachers.length})
          </label>
          <div className="bg-background border border-border rounded-lg p-2 h-64 overflow-y-auto space-y-1 custom-scrollbar">
            {teamLeaders.map(teacher => (
              <label key={teacher.id} className="flex items-center gap-3 p-2 cursor-pointer hover:bg-surface rounded-md transition-colors border border-transparent hover:border-border">
                <input
                  type="checkbox"
                  checked={selectedTeachers.some(t => t.id === teacher.id)}
                  onChange={() => toggleUser(teacher, selectedTeachers, setSelectedTeachers)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  {teacher.avatar}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-text truncate">{teacher.name}</div>
                  <div className="text-xs text-muted truncate">{teacher.email}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Students Selection */}
        <div>
          <label className="block text-sm font-medium text-muted mb-2 flex items-center gap-2">
            <GraduationCap size={16} className="text-green-600" />
            Students ({selectedStudents.length})
          </label>
          <div className="bg-background border border-border rounded-lg p-2 h-64 overflow-y-auto space-y-1 custom-scrollbar">
            {employees.map(student => (
              <label key={student.id} className="flex items-center gap-3 p-2 cursor-pointer hover:bg-surface rounded-md transition-colors border border-transparent hover:border-border">
                <input
                  type="checkbox"
                  checked={selectedStudents.some(s => s.id === student.id)}
                  onChange={() => toggleUser(student, selectedStudents, setSelectedStudents)}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  {student.avatar}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-text truncate">{student.name}</div>
                  <div className="text-xs text-muted truncate">{student.email}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Courses Selection */}
      <div>
        <label className="block text-sm font-medium text-muted mb-2 flex items-center gap-2">
          <BookOpen size={16} className="text-purple-600" />
          Assign Courses ({selectedCourses.length})
        </label>
        <div className="bg-background border border-border rounded-lg p-2 max-h-48 overflow-y-auto space-y-1 custom-scrollbar">
          {availableCourses.map(course => (
            <label key={course.id} className="flex items-start gap-3 p-2 cursor-pointer hover:bg-surface rounded-md transition-colors border border-transparent hover:border-border">
              <input
                type="checkbox"
                checked={selectedCourses.some(c => c.id === course.id)}
                onChange={() => toggleCourse(course)}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 mt-1 flex-shrink-0"
              />
              <div className="min-w-0">
                <div className="text-sm font-medium text-text">{course.name}</div>
                <div className="text-xs text-muted mt-1">{course.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-4 pt-6 border-t border-border">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 text-text bg-background border border-border rounded-lg hover:bg-gray-50 transition-colors font-medium shadow-sm"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!groupName.trim()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-300 disabled:text-muted disabled:cursor-not-allowed shadow-sm"
        >
          {submitButtonText}
        </button>
      </div>

      {/* Scrollbar Utility */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
};



