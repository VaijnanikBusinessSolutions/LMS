



import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Sidebar from './Components/Sidebar';
import Scheduling from './Components/Scheduling';
import CalendarOverview from './Components/CalendarOverview';
import Notification from './Components/Notification';
import Training from './Components/Training';
import Curriculum from './Components/Curriculum';
import Status from './Components/Status';
import RecurrenceTracker from './Components/RecurrenceTracker';
import RescheduleList from './Components/RescheduleList';

const VALID_MODULES = [
  'scheduling',
  'calendar',
  'notification',
  'training',
  'reschedule-list',
  'curriculum',
  'recurrence',
  'status',
];

function App() {
  const [searchParams, setSearchParams] = useSearchParams();

  const moduleParam = searchParams.get('module');
  const activeModule = VALID_MODULES.includes(moduleParam || '') ? moduleParam! : 'scheduling';

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | string | null>(null);
  const [selectedTopicId, setSelectedTopicId] = useState<number | string | null>(null);

  const handleModuleChange = (moduleName: string) => {
    setSearchParams({ module: moduleName });
  };

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'scheduling':
        return <Scheduling />;
      case 'calendar':
        return <CalendarOverview />;
      case 'notification':
        return <Notification />;
      case 'training':
        return (
          <Training
            setActiveModule={handleModuleChange}
            setSelectedCategoryId={setSelectedCategoryId}
            setSelectedTopicId={setSelectedTopicId}
          />
        );
      case 'reschedule-list':
        return <RescheduleList />;
      case 'curriculum':
        return (
          <Curriculum
            selectedCategoryId={selectedCategoryId}
            selectedTopicId={selectedTopicId}
            setSelectedCategoryId={setSelectedCategoryId}
            setSelectedTopicId={setSelectedTopicId}
          />
        );
      case 'recurrence':
        return <RecurrenceTracker />;
      case 'status':
        return <Status />;
      default:
        return <Scheduling />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-text flex">
      <div className="border-r border-border">
        <Sidebar activeModule={activeModule} setActiveModule={handleModuleChange} />
      </div>

      <main className="flex-1 p-8 overflow-y-auto">
        {renderActiveModule()}
      </main>
    </div>
  );
}

export default App;