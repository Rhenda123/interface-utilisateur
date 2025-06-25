
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function ScheduleModule() {
  const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
  const hours = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00"];

  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem("skoolife_courses");
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedDay, setSelectedDay] = useState("Lundi");
  const [selectedHour, setSelectedHour] = useState("08:00");
  const [courseName, setCourseName] = useState("");

  useEffect(() => {
    localStorage.setItem("skoolife_courses", JSON.stringify(courses));
  }, [courses]);

  const addCourse = () => {
    if (!courseName.trim()) return;
    const newCourse = { day: selectedDay, hour: selectedHour, name: courseName };
    setCourses([...courses, newCourse]);
    setCourseName("");
  };

  const getCourseAt = (day: string, hour: string) => {
    return courses.find((c: any) => c.day === day && c.hour === hour)?.name || "-";
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
      
      <Card className="border-yellow-200 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <select 
              value={selectedDay} 
              onChange={(e) => setSelectedDay(e.target.value)} 
              className="w-full sm:w-auto border-2 border-yellow-200 dark:border-gray-600 bg-yellow-50 dark:bg-gray-700 rounded-lg px-4 py-3 font-medium text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 focus:outline-none"
            >
              {days.map(d => <option key={d}>{d}</option>)}
            </select>
            <select 
              value={selectedHour} 
              onChange={(e) => setSelectedHour(e.target.value)} 
              className="w-full sm:w-auto border-2 border-yellow-200 dark:border-gray-600 bg-yellow-50 dark:bg-gray-700 rounded-lg px-4 py-3 font-medium text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 focus:outline-none"
            >
              {hours.map(h => <option key={h}>{h}</option>)}
            </select>
            <Input 
              type="text" 
              placeholder="Nom du cours" 
              value={courseName} 
              onChange={(e) => setCourseName(e.target.value)} 
              className="flex-1 border-2 border-yellow-200 dark:border-gray-600 bg-yellow-50 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400" 
            />
            <Button 
              onClick={addCourse} 
              className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-6 py-3 rounded-lg font-semibold shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105"
            >
              Ajouter
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-yellow-200 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-gradient-to-r from-yellow-100 to-yellow-200 dark:from-yellow-900 dark:to-yellow-800">
                  <th className="px-4 py-4 text-left font-semibold text-gray-800 dark:text-gray-200 border-b border-yellow-300 dark:border-yellow-600"></th>
                  {days.map((day) => (
                    <th key={day} className="px-4 py-4 text-center font-semibold text-gray-800 dark:text-gray-200 min-w-[120px] border-b border-yellow-300 dark:border-yellow-600">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {hours.map((hour, hourIndex) => (
                  <tr key={hour} className={hourIndex % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-yellow-50/30 dark:bg-gray-700/30"}>
                    <td className="px-4 py-4 font-semibold text-gray-700 dark:text-gray-300 bg-yellow-100 dark:bg-yellow-900 border-r border-yellow-200 dark:border-yellow-700">
                      {hour}
                    </td>
                    {days.map((day, dayIndex) => (
                      <td key={dayIndex} className="px-4 py-4 text-center text-sm border-r border-yellow-100 dark:border-gray-600 last:border-r-0">
                        <div className={`${getCourseAt(day, hour) !== "-" ? "bg-yellow-200 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100 px-3 py-2 rounded-lg font-medium shadow-sm" : "text-gray-400 dark:text-gray-500"}`}>
                          {getCourseAt(day, hour)}
                        </div>
                      </td>
                    ))}
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
