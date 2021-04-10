import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { SortableItem } from './SortableItem'

export const SectionsColumn = ({
  selectedSections,
  setSelectedSections,
  sections,
  setSections,
  setFocusedSectionSlug,
  focusedSectionSlug,
  getTemplate,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const onAddSection = (e, section) => {
    setSections((prev) => prev.filter((s) => s !== section))
    setSelectedSections((prev) => [...prev, section])
    setFocusedSectionSlug(section)
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (active.id !== over.id) {
      setSelectedSections((sections) => {
        const oldIndex = sections.findIndex((s) => s === active.id)
        const newIndex = sections.findIndex((s) => s === over.id)

        return arrayMove(sections, oldIndex, newIndex)
      })
    }
  }

  const onDeleteSection = (e, sectionSlug) => {
    e.stopPropagation()
    setSelectedSections((prev) => prev.filter((s) => s !== sectionSlug))
    setSections((prev) => [...prev, sectionSlug])
    setFocusedSectionSlug(null)
  }

  return (
    <div className="sections">
      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-3">Sections</h3>
      <div className="max-h-screen overflow-scroll px-3 pr-4">
        {selectedSections.length > 0 && (
          <h4 className="text-xs leading-6 text-gray-900 mb-3">
            Click on a section below to edit the contents
          </h4>
        )}
        <ul className="space-y-3 mb-12">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext items={selectedSections} strategy={verticalListSortingStrategy}>
              {selectedSections.map((s) => (
                <SortableItem
                  key={s}
                  id={s}
                  section={getTemplate(s)}
                  focusedSectionSlug={focusedSectionSlug}
                  setFocusedSectionSlug={setFocusedSectionSlug}
                  onDeleteSection={onDeleteSection}
                />
              ))}
            </SortableContext>
          </DndContext>
        </ul>
        {sections.length > 0 && (
          <h4 className="text-xs leading-6 text-gray-900 mb-3">
            Click on a section below to add it to your readme
          </h4>
        )}
        <ul className="space-y-3 mb-12">
          {sections.map((s) => (
            <li
              onClick={(e) => onAddSection(e, s)}
              key={s}
              className="bg-white shadow rounded-md pl-3 pr-6 py-2 flex items-center cursor-pointer"
            >
              <p>{getTemplate(s).name}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
