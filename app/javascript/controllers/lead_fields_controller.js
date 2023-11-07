import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    this.draggables = this.element.querySelectorAll('.draggable:not(.dragging)')
    // this.element is the lead-fields-container
  }

  addDraggingClass(event) {
    event.currentTarget.classList.add('dragging')
  }

  removeDraggingClass(event) {
    event.currentTarget.classList.remove('dragging')
  }

  resortAndInsert(event) {
    event.preventDefault()
    const afterElement = this.getDragAfterElement(this.element, event.clientY)
    const draggingElement = this.element.querySelector('.dragging')
    if (afterElement == null) {
      this.element.appendChild(draggingElement)
    } else {
      this.element.insertBefore(draggingElement, afterElement)
    }
  }

  getDragAfterElement(container, y) {
    const draggableElements = [...this.draggables]
    return draggableElements.reduce((closest, child) => {
      const childBox = child.getBoundingClientRect()
      const topOffsetOfChildBox = childBox.top + childBox.height/2
      const cursorOffset = y - topOffsetOfChildBox
      if (cursorOffset < 0 && cursorOffset > closest.offset) {
        return { offset: cursorOffset, element: child }
      } else {
        return closest
      }
    }, {offset: Number.NEGATIVE_INFINITY}).element
  }
}
