import { Filter } from 'lucide-react'
import { clsx } from 'clsx'
import { getCategoryColors } from '@/lib/colors'
import type { LevelType, CourseType } from '@/lib/types'

interface FilterBarProps {
  selectedGrades: number[]
  onGradesChange: (grades: number[]) => void
  availableGrades?: number[]
  selectedLevels: LevelType[]
  onLevelsChange: (levels: LevelType[]) => void
  selectedCourses: CourseType[]
  onCoursesChange: (courses: CourseType[]) => void
  categoryId?: string
}

export function FilterBar({
  selectedGrades,
  onGradesChange,
  availableGrades = [6, 7, 9, 10],
  selectedLevels,
  onLevelsChange,
  selectedCourses,
  onCoursesChange,
  categoryId,
}: FilterBarProps) {
  const colors = categoryId ? getCategoryColors(categoryId) : getCategoryColors('mechanik')
  
  const toggleGrade = (grade: number) => {
    if (selectedGrades.includes(grade)) {
      onGradesChange(selectedGrades.filter((g) => g !== grade))
    } else {
      onGradesChange([...selectedGrades, grade])
    }
  }

  const toggleLevel = (level: LevelType) => {
    if (selectedLevels.includes(level)) {
      onLevelsChange(selectedLevels.filter((l) => l !== level))
    } else {
      onLevelsChange([...selectedLevels, level])
    }
  }

  const toggleCourse = (course: CourseType) => {
    if (selectedCourses.includes(course)) {
      onCoursesChange(selectedCourses.filter((c) => c !== course))
    } else {
      onCoursesChange([...selectedCourses, course])
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Filter className="h-4 w-4" aria-hidden="true" />
        <span>Filter</span>
      </div>

      {/* Level Filter (Sek I / Sek II) */}
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-2 block">
          Schulstufe
        </label>
        <div className="flex flex-wrap gap-2">
          {(['Sek I', 'Sek II'] as LevelType[]).map((level) => {
            const isSelected = selectedLevels.includes(level)
            return (
              <button
                key={level}
                onClick={() => toggleLevel(level)}
                className={clsx(
                  'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-offset-2',
                  categoryId ? colors.ring : 'focus:ring-ring',
                  isSelected
                    ? categoryId ? `${colors.primaryBg} text-white hover:opacity-90` : 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                )}
                aria-pressed={isSelected}
                aria-label={`${level}${isSelected ? ' ausgewählt' : ''}`}
              >
                {level}
              </button>
            )
          })}
        </div>
      </div>

      {/* Grade Filter (Only Sek I) */}
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-2 block">
          Klassenstufe (Sek I)
        </label>
        <div className="flex flex-wrap gap-2">
          {availableGrades.map((grade) => {
            const isSelected = selectedGrades.includes(grade)
            return (
              <button
                key={grade}
                onClick={() => toggleGrade(grade)}
                className={clsx(
                  'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-offset-2',
                  categoryId ? colors.ring : 'focus:ring-ring',
                  isSelected
                    ? categoryId ? `${colors.primaryBg} text-white hover:opacity-90` : 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                )}
                aria-pressed={isSelected}
                aria-label={`Klasse ${grade}${isSelected ? ' ausgewählt' : ''}`}
              >
                Klasse {grade}
              </button>
            )
          })}
        </div>
      </div>

      {/* Course Type Filter (EF / GK / LK) */}
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-2 block">
          Kursart (Sek II)
        </label>
        <div className="flex flex-wrap gap-2">
          {(['EF', 'GK', 'LK'] as CourseType[]).map((course) => {
            const isSelected = selectedCourses.includes(course)
            return (
              <button
                key={course}
                onClick={() => toggleCourse(course)}
                className={clsx(
                  'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-offset-2',
                  categoryId ? colors.ring : 'focus:ring-ring',
                  isSelected
                    ? categoryId ? `${colors.primaryBg} text-white hover:opacity-90` : 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                )}
                aria-pressed={isSelected}
                aria-label={`${course}${isSelected ? ' ausgewählt' : ''}`}
              >
                {course}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

