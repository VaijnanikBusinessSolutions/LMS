// // import { CheckCircle2, Clock, Edit2, Users, Tag, BookOpen } from 'lucide-react';
// import DashboardView from '../Dashboard/Dashboard';
// import CoursesView from '../Courses/Courses';

// interface MainContentProps {
//   activeTab: string;
// }

// const MainContent = ({ activeTab }: MainContentProps) => {
//   return (
//     <div className="flex-1  p-8">
//       {activeTab === 'dashboard' ? <DashboardView /> : <CoursesView />}
//     </div>
//   );
// };

// export default MainContent;
// import { CheckCircle2, Clock, Edit2, Users, Tag, BookOpen } from 'lucide-react';
import DashboardView from '../Dashboard/Dashboard';
import CoursesView from '../Courses/Courses';

interface MainContentProps {
  activeTab: string;
}

const MainContent = ({ activeTab }: MainContentProps) => {
  return (
    <div className="flex-1 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 overflow-auto">
      <div className="max-w-[1600px] mx-auto">
        {activeTab === 'dashboard' ? <DashboardView /> : <CoursesView />}
      </div>
    </div>
  );
};

export default MainContent;