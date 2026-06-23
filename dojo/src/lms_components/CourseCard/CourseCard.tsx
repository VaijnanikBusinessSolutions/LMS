


import { BookOpen, CircleCheck, Tag, Users, Clock, BarChart3, Star } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { useState } from "react";

interface CourseCardProps {
  course: {
    id: number;
    title: string;
    instructor_name: string;
    level: string;
    duration: string;
    description: string;
    tags: string[];
    questions: number;
    updated: string;
    created: string;
    is_published: boolean;
    stats: {
      accuracy: number;
      completion: number;
      enrolled: number;
      rating: string;
      duration: string;
    };
    photo?: string | null;
  };
}

const CourseCard = ({ course }: CourseCardProps) => {
  const [imageError, setImageError] = useState(false);

  // Provide default stats if undefined
  const stats = course.stats || {
    accuracy: 0,
    completion: 0,
    enrolled: 0,
    rating: "0.0",
    duration: "0 hours"
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return "Recently";
    }
  };

  return (
    <div className="bg-surface rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-border group flex flex-col h-full">
      {/* Course Image */}
      <div className="relative aspect-video bg-background overflow-hidden">
        {course.photo && !imageError ? (
          <img
            src={course.photo}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-300 to-pink-200">
            <BookOpen className="w-16 h-16 text-purple-300 opacity-50" />
          </div>
        )}
        
        {/* Level Badge */}
        <div className="absolute top-4 right-4 z-10">
          <span className="bg-white/90 backdrop-blur-sm text-purple-700 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm border border-purple-100">
            {course.level}
          </span>
        </div>
        
        {/* Overlay gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {course.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="text-[10px] uppercase font-bold px-2.5 py-1 rounded-lg bg-background text-muted border border-border hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200 transition-colors"
            >
              {tag}
            </span>
          ))}
          {course.tags.length > 3 && (
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-background text-muted border border-border">
              +{course.tags.length - 3}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-text mb-1 line-clamp-2 group-hover:text-purple-600 transition-colors cursor-pointer leading-tight">
          {course.title}
        </h3>

        {/* Instructor */}
        <p className="text-xs text-muted mb-5 font-medium uppercase tracking-wide">
          by {course.instructor_name}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-5 mt-auto">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-background border border-border">
            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
              <CircleCheck size={16} className="text-green-600" />
            </div>
            <div>
              <p className="text-[10px] text-muted uppercase font-bold">Accuracy</p>
              <p className="text-sm font-bold text-text">{stats.accuracy}%</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-2 rounded-xl bg-background border border-border">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
              <BarChart3 size={16} className="text-blue-600" />
            </div>
            <div>
              <p className="text-[10px] text-muted uppercase font-bold">Done</p>
              <p className="text-sm font-bold text-text">{stats.completion}%</p>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5" title="Enrolled Students">
              <Users size={14} className="text-pink-500" />
              <span className="text-xs font-bold text-text">{stats.enrolled}</span>
            </div>
            <div className="flex items-center gap-1.5" title="Questions">
              <Tag size={14} className="text-purple-500" />
              <span className="text-xs font-bold text-text">{course.questions} Q</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 text-muted text-[10px] font-medium">
            <Clock size={12} />
            <span>{formatDate(course.updated)}</span>
          </div>
        </div>

        {/* Rating (Optional) */}
        {stats.rating !== "0.0" && (
          <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm border border-yellow-100 flex items-center gap-1">
            <Star size={12} className="text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-bold text-gray-800">{stats.rating}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCard;