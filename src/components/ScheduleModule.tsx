
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2, Trash2, AlertTriangle, Plus, X, Check } from "lucide-react";

interface Course {
  id: string;
  day: string;
  hour: string;
  name: string;
  color: string;
  professor?: string;
  room?: string;
}

function ScheduleModule() {
  const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
  const hours = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
  
  const courseColors = [
    "#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4", 
    "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"
  ];

  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem("skoolife_courses");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [selectedDay, setSelectedDay] = useState("Lundi");
  const [selectedHour, setSelectedHour] = useState("08:00");
  const [courseName, setCourseName] = useState("");
  const [professor, setProfessor] = useState("");
  const [room, setRoom] = useState("");
  const [selectedColor, setSelectedColor] = useState(courseColors[0]);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [conflicts, setConflicts] = useState<string[]>([]);

  useEffect(() => {
    localStorage.setItem("skoolife_courses", JSON.stringify(courses));
    checkTimeConflicts();
  }, [courses]);

  const checkTimeConflicts = () => {
    const conflictKeys: string[] = [];
    const timeSlots = new Map<string, Course[]>();
    
    courses.forEach(course => {
      const key = `${course.day}-${course.hour}`;
      if (!timeSlots.has(key)) {
        timeSlots.set(key, []);
      }
      timeSlots.get(key)!.push(course);
    });
    
    timeSlots.forEach((coursesInSlot, key) => {
      if (coursesInSlot.length > 1) {
        conflictKeys.push(key);
      }
    });
    
    setConflicts(conflictKeys);
  };

  const addOrUpdateCourse = () => {
    if (!courseName.trim()) return;
    
    if (editingCourse) {
      setCourses(courses.map(c => 
        c.id === editingCourse.id 
          ? { ...c, day: selectedDay, hour: selectedHour, name: courseName, professor, room, color: selectedColor }
          : c
      ));
      setEditingCourse(null);
    } else {
      const newCourse: Course = {
        id: Date.now().toString(),
        day: selectedDay,
        hour: selectedHour,
        name: courseName,
        professor,
        room,
        color: selectedColor
      };
      setCourses([...courses, newCourse]);
    }
    
    resetForm();
  };

  const editCourse = (course: Course) => {
    setEditingCourse(course);
    setSelectedDay(course.day);
    setSelectedHour(course.hour);
    setCourseName(course.name);
    setProfessor(course.professor || "");
    setRoom(course.room || "");
    setSelectedColor(course.color);
  };

  const deleteCourse = (courseId: string) => {
    setCourses(courses.filter(c => c.id !== courseId));
  };

  const resetForm = () => {
    setCourseName("");
    setProfessor("");
    setRoom("");
    setSelectedColor(courseColors[0]);
    setEditingCourse(null);
  };

  const getCoursesAt = (day: string, hour: string): Course[] => {
    return courses.filter(c => c.day === day && c.hour === hour);
  };

  const hasConflict = (day: string, hour: string): boolean => {
    return conflicts.includes(`${day}-${hour}`);
  };

  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Mon Emploi du Temps</h2>
        <div className="text-sm text-gray-600 dark:text-gray-300 font-medium bg-yellow-100 dark:bg-yellow-900 px-3 py-2 rounded-full border border-yellow-200 dark:border-yellow-700">
          {currentMonth}
        </div>
      </div>

      {/* Add/Edit Course Form */}
      <Card className="border-yellow-200 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800">
        <CardContent className="p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            {editingCourse ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            {editingCourse ? "Modifier le Cours" : "Ajouter un Cours"}
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
            <select 
              value={selectedDay} 
              onChange={(e) => setSelectedDay(e.target.value)} 
              className="border-2 border-yellow-200 dark:border-gray-600 bg-yellow-50 dark:bg-gray-700 rounded-lg px-4 py-3 font-medium text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 focus:outline-none"
            >
              {days.map(d => <option key={d}>{d}</option>)}
            </select>
            
            <select 
              value={selectedHour} 
              onChange={(e) => setSelectedHour(e.target.value)} 
              className="border-2 border-yellow-200 dark:border-gray-600 bg-yellow-50 dark:bg-gray-700 rounded-lg px-4 py-3 font-medium text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 focus:outline-none"
            >
              {hours.map(h => <option key={h}>{h}</option>)}
            </select>
            
            <Input 
              type="text" 
              placeholder="Nom du cours" 
              value={courseName} 
              onChange={(e) => setCourseName(e.target.value)} 
              className="border-2 border-yellow-200 dark:border-gray-600 bg-yellow-50 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400" 
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <Input 
              type="text" 
              placeholder="Professeur (optionnel)" 
              value={professor} 
              onChange={(e) => setProfessor(e.target.value)} 
              className="border-2 border-yellow-200 dark:border-gray-600 bg-yellow-50 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400" 
            />
            
            <Input 
              type="text" 
              placeholder="Salle (optionnel)" 
              value={room} 
              onChange={(e) => setRoom(e.target.value)} 
              className="border-2 border-yellow-200 dark:border-gray-600 bg-yellow-50 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400" 
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Couleur du cours</label>
            <div className="flex gap-2 flex-wrap">
              {courseColors.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    selectedColor === color ? 'border-gray-900 dark:border-white scale-110' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={addOrUpdateCourse} 
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-6 py-3 rounded-lg font-semibold shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105 flex items-center gap-2"
            >
              {editingCourse ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {editingCourse ? "Modifier" : "Ajouter"}
            </Button>
            
            {editingCourse && (
              <Button 
                onClick={resetForm} 
                variant="outline"
                className="px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Annuler
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Conflicts Warning */}
      {conflicts.length > 0 && (
        <Card className="border-red-200 dark:border-red-700 shadow-lg bg-red-50 dark:bg-red-900/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-semibold">Conflits d'horaires détectés!</span>
            </div>
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">
              Certains créneaux ont plusieurs cours programmés. Vérifiez votre planning.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Schedule Table */}
      <Card className="border-yellow-200 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gradient-to-r from-yellow-100 to-yellow-200 dark:from-yellow-900 dark:to-yellow-800">
                  <th className="px-4 py-4 text-left font-semibold text-gray-800 dark:text-gray-200 border-b border-yellow-300 dark:border-yellow-600 w-20"></th>
                  {days.map((day) => (
                    <th key={day} className="px-4 py-4 text-center font-semibold text-gray-800 dark:text-gray-200 min-w-[160px] border-b border-yellow-300 dark:border-yellow-600">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {hours.map((hour, hourIndex) => (
                  <tr key={hour} className={hourIndex % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-yellow-50/30 dark:bg-gray-700/30"}>
                    <td className="px-4 py-4 font-semibold text-gray-700 dark:text-gray-300 bg-yellow-100 dark:bg-yellow-900 border-r border-yellow-200 dark:border-yellow-700 text-sm">
                      {hour}
                    </td>
                    {days.map((day, dayIndex) => {
                      const coursesAtSlot = getCoursesAt(day, hour);
                      const hasConflictHere = hasConflict(day, hour);
                      
                      return (
                        <td key={dayIndex} className="px-2 py-2 text-center text-xs border-r border-yellow-100 dark:border-gray-600 last:border-r-0 relative">
                          {coursesAtSlot.length === 0 ? (
                            <div className="text-gray-400 dark:text-gray-500 py-4">-</div>
                          ) : (
                            <div className="space-y-1">
                              {coursesAtSlot.map((course, index) => (
                                <div
                                  key={course.id}
                                  className={`p-2 rounded-lg shadow-sm text-white font-medium relative group ${
                                    hasConflictHere ? 'ring-2 ring-red-400 animate-pulse' : ''
                                  }`}
                                  style={{ backgroundColor: course.color }}
                                >
                                  <div className="font-semibold text-xs leading-tight">{course.name}</div>
                                  {course.professor && (
                                    <div className="text-xs opacity-90 mt-1">{course.professor}</div>
                                  )}
                                  {course.room && (
                                    <div className="text-xs opacity-80">{course.room}</div>
                                  )}
                                  
                                  <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                    <button
                                      onClick={() => editCourse(course)}
                                      className="bg-white/20 hover:bg-white/30 rounded p-1 transition-colors"
                                    >
                                      <Edit2 className="w-3 h-3" />
                                    </button>
                                    <button
                                      onClick={() => deleteCourse(course.id)}
                                      className="bg-white/20 hover:bg-red-500 rounded p-1 transition-colors"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                  
                                  {hasConflictHere && (
                                    <div className="absolute -top-1 -right-1">
                                      <AlertTriangle className="w-4 h-4 text-red-500 bg-white rounded-full p-0.5" />
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ScheduleModule;
