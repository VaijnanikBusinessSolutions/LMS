import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Users, UserCheck, GraduationCap, Save, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  role: 'Team Leader' | 'Employee';
  avatar: string;
  email: string;
}

interface Course {
  id: string;
  name: string;
  description: string;
}

interface Group {
  id: string;
  name: string;
  teachers: User[];
  students: User[];
  assignedCourses: Course[];
  createdAt: Date;
}

const EditGroupPage: React.FC = () => {
  const navigate = useNavigate();

  // Mock existing group data
  const existingGroup: Group = {
    id: 'grp-fdev-01',
    name: 'Frontend Development Team',
    teachers: [
      { id: 't1', name: 'John Smith', role: 'Team Leader', avatar: 'JS', email: 'john@example.com' },
      { id: 't2', name: 'Sarah Wilson', role: 'Team Leader', avatar: 'SW', email: 'sarah@example.com' }
    ],
    students: [
      { id: 's1', name: 'David Brown', role: 'Employee', avatar: 'D', email: 'david@example.com' },
      { id: 's2', name: 'Emily Davis', role: 'Employee', avatar: 'E', email: 'emily@example.com' }
    ],
    assignedCourses: [
      { id: 'c1', name: 'React Development', description: 'Learn React from basics to advanced' },
      { id: 'c2', name: 'UI/UX Design', description: 'Master design principles and tools' }
    ],
    createdAt: new Date('2024-01-15')
  };

  const [groupName, setGroupName] = useState(existingGroup.name);
  const [selectedTeachers, setSelectedTeachers] = useState<User[]>(existingGroup.teachers);
  const [selectedStudents, setSelectedStudents] = useState<User[]>(existingGroup.students);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>(existingGroup.assignedCourses);

  // Mock data for all available users and courses
  const availableUsers: User[] = [
    { id: 't1', name: 'John Smith', role: 'Team Leader', avatar: 'JS', email: 'john@example.com' },
    { id: 't2', name: 'Sarah Wilson', role: 'Team Leader', avatar: 'SW', email: 'sarah@example.com' },
    { id: 't3', name: 'Mike Johnson', role: 'Team Leader', avatar: 'MJ', email: 'mike@example.com' },
    { id: 't4', name: 'Lisa Chen', role: 'Team Leader', avatar: 'LC', email: 'lisa@example.com' },
    { id: 't5', name: 'Robert Taylor', role: 'Team Leader', avatar: 'RT', email: 'robert@example.com' },
    { id: 's1', name: 'David Brown', role: 'Employee', avatar: 'D', email: 'david@example.com' },
    { id: 's2', name: 'Emily Davis', role: 'Employee', avatar: 'E', email: 'emily@example.com' },
    { id: 's3', name: 'Alex Martinez', role: 'Employee', avatar: 'A', email: 'alex@example.com' },
    { id: 's4', name: 'Jessica Lee', role: 'Employee', avatar: 'J', email: 'jessica@example.com' },
    { id: 's5', name: 'Chris Wilson', role: 'Employee', avatar: 'C', email: 'chris@example.com' },
    { id: 's6', name: 'Maya Patel', role: 'Employee', avatar: 'M', email: 'maya@example.com' }
  ];

  const availableCourses: Course[] = [
    { id: 'c1', name: 'React Development', description: 'Learn React from basics to advanced concepts' },
    { id: 'c2', name: 'UI/UX Design', description: 'Master design principles and modern tools' },
    { id: 'c3', name: 'Node.js Backend', description: 'Build scalable backend applications' },
    { id: 'c4', name: 'Python Programming', description: 'Comprehensive Python programming course' },
    { id: 'c5', name: 'Data Analysis', description: 'Analyze data with modern statistical tools' },
    { id: 'c6', name: 'Machine Learning', description: 'Introduction to ML algorithms and practices' },
    { id: 'c7', name: 'Database Design', description: 'Design and optimize database architectures' },
    { id: 'c8', name: 'DevOps Fundamentals', description: 'Learn CI/CD and infrastructure management' }
  ];

  const teamLeaders = availableUsers.filter(user => user.role === 'Team Leader');
  const employees = availableUsers.filter(user => user.role === 'Employee');
  
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

  const handleSubmit = () => {
    if (!groupName.trim()) {
      alert('Group name cannot be empty.');
      return;
    }
    if (selectedTeachers.length === 0) {
      alert('A group must have at least one team leader.');
      return;
    }
    const updatedGroupData = {
      id: existingGroup.id,
      name: groupName,
      teachers: selectedTeachers,
      students: selectedStudents,
      courses: selectedCourses
    };
    navigate('/Group');
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete the group "${groupName}"? This action cannot be undone.`)) {
      console.log('Deleting group:', existingGroup.id);
      alert(`Group "${groupName}" has been deleted.`);
      navigate('/Group');
    }
  };

  // Common card styling with updated tokens
  const cardClasses = "bg-surface border border-border rounded-xl p-6 shadow-sm";

  return (
    <div className="bg-background text-text min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/Group')} 
              className="p-2 text-muted hover:text-text hover:bg-surface border border-transparent hover:border-border rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-text">Edit Group</h1>
              <p className="text-muted mt-1">Modify settings and member assignments</p>
            </div>
          </div>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:text-red-700 transition-colors"
          >
            <Trash2 size={16} />
            Delete Group
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            <div className={cardClasses}>
              <h2 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
                <Users size={20} className="text-blue-600" />
                Group Details
              </h2>
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Group Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-text placeholder-muted focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
              <div className="mt-4 pt-4 border-t border-dashed border-border text-sm text-muted space-y-2">
                <div className="flex justify-between items-center">
                  <span>Created:</span>
                  <span className="font-medium text-text">{existingGroup.createdAt.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Group ID:</span>
                  <span className="font-mono text-xs bg-gray-100 text-text px-2 py-1 rounded border border-border">{existingGroup.id}</span>
                </div>
              </div>
            </div>

            <div className={cardClasses}>
              <h3 className="text-lg font-semibold text-text mb-4">Changes Summary</h3>
              <div className="space-y-3 text-sm">
                {[
                  { label: 'Team Leaders', original: existingGroup.teachers, current: selectedTeachers, color: 'blue' },
                  { label: 'Students', original: existingGroup.students, current: selectedStudents, color: 'green' },
                  { label: 'Courses', original: existingGroup.assignedCourses, current: selectedCourses, color: 'purple' }
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between border-b border-border pb-2 last:border-0 last:pb-0">
                    <span className="text-muted">{item.label}</span>
                    <div className="flex items-center gap-2 font-medium">
                      <span className="text-text">{item.original.length}</span>
                      <span className="text-muted">→</span>
                      <span className={`text-${item.color}-600 font-bold`}>
                        {item.current.length}
                      </span>
                    </div>
                  </div>
                ))}
                <div className="border-t border-border pt-4 mt-4">
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-text">Total Members</span>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted font-medium">{existingGroup.teachers.length + existingGroup.students.length}</span>
                        <span className="text-muted">→</span>
                        <span className="text-text">{selectedTeachers.length + selectedStudents.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {[
              { title: 'Team Leaders', icon: UserCheck, color: 'blue', data: teamLeaders, selected: selectedTeachers, original: existingGroup.teachers, toggle: (u: User) => toggleUser(u, selectedTeachers, setSelectedTeachers) },
              { title: 'Students', icon: GraduationCap, color: 'green', data: employees, selected: selectedStudents, original: existingGroup.students, toggle: (u: User) => toggleUser(u, selectedStudents, setSelectedStudents) }
            ].map(section => (
              <div key={section.title} className={cardClasses}>
                <h2 className={`text-lg font-semibold text-text mb-4 flex items-center gap-2`}>
                  <section.icon size={20} className={`text-${section.color}-600`} />
                  {section.title} ({section.selected.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                  {section.data.map(user => {
                    const isSelected = section.selected.some(u => u.id === user.id);
                    const wasOriginallySelected = section.original.some(u => u.id === user.id);
                    const isChanged = isSelected !== wasOriginallySelected;
                    return (
                      <label key={user.id} className={`flex items-center gap-3 p-3 cursor-pointer rounded-lg border transition-all ${isSelected ? `bg-blue-50 border-${section.color}-200` : 'bg-background border-border hover:bg-gray-50'} ${isChanged ? `ring-2 ring-offset-1 ring-${section.color}-400` : ''}`}>
                        <input type="checkbox" checked={isSelected} onChange={() => section.toggle(user)} className={`w-4 h-4 text-${section.color}-600 border-gray-300 rounded focus:ring-${section.color}-500`} />
                        <div className={`w-8 h-8 bg-${section.color}-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm`}>{user.avatar}</div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-text truncate">{user.name}</div>
                          <div className="text-xs text-muted truncate">{user.email}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
            
            <div className={cardClasses}>
              <h2 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
                <BookOpen size={20} className="text-purple-600" />
                Courses ({selectedCourses.length})
              </h2>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {availableCourses.map(course => {
                  const isSelected = selectedCourses.some(c => c.id === course.id);
                  const wasOriginallySelected = existingGroup.assignedCourses.some(c => c.id === course.id);
                  const isChanged = isSelected !== wasOriginallySelected;
                  return (
                    <label key={course.id} className={`flex items-start gap-4 p-3 cursor-pointer rounded-lg border transition-all ${isSelected ? 'bg-purple-50 border-purple-200' : 'bg-background border-border hover:bg-gray-50'} ${isChanged ? 'ring-2 ring-offset-1 ring-purple-400' : ''}`}>
                      <input type="checkbox" checked={isSelected} onChange={() => toggleCourse(course)} className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-text">{course.name}</div>
                        <div className="text-xs text-muted mt-0.5 line-clamp-1">{course.description}</div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={() => navigate('/Group')}
            className="px-6 py-2 text-text bg-surface border border-border rounded-lg hover:bg-gray-50 transition-colors font-medium shadow-sm"
          >
            Cancel Changes
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!groupName.trim() || selectedTeachers.length === 0}
            className="flex items-center gap-2 px-8 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            <Save size={16} />
            Update Group
          </button>
        </div>
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

export default EditGroupPage;
