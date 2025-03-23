import { useState, useCallback } from 'react';

/**
 * Hook for handling drag and drop functionality
 */
export const useDragDrop = <T extends { id: string }>(initialItems: T[] = []) => {
  const [items, setItems] = useState<T[]>(initialItems);
  const [draggedItem, setDraggedItem] = useState<T | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Start dragging an item
  const handleDragStart = useCallback((item: T) => {
    setDraggedItem(item);
    setIsDragging(true);
  }, []);
  
  // Handle drag over event
  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
  }, []);
  
  // Handle dropping an item
  const handleDrop = useCallback((event: React.DragEvent, dropPosition: { x: number; y: number }) => {
    event.preventDefault();
    
    if (!draggedItem) return false;
    
    // Create a new drop handler for external customization
    const dropEvent = {
      item: draggedItem,
      position: dropPosition,
      originalEvent: event
    };
    
    setIsDragging(false);
    return dropEvent;
  }, [draggedItem]);
  
  // End dragging
  const handleDragEnd = useCallback(() => {
    setDraggedItem(null);
    setIsDragging(false);
  }, []);
  
  // Add an item
  const addItem = useCallback((item: T) => {
    setItems(prevItems => [...prevItems, item]);
  }, []);
  
  // Update an item
  const updateItem = useCallback((updatedItem: T) => {
    setItems(prevItems => 
      prevItems.map(item => (item.id === updatedItem.id ? updatedItem : item))
    );
  }, []);
  
  // Remove an item
  const removeItem = useCallback((itemId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== itemId));
  }, []);
  
  // Move an item to a new position in the array
  const moveItem = useCallback((itemId: string, toIndex: number) => {
    setItems(prevItems => {
      const itemIndex = prevItems.findIndex(item => item.id === itemId);
      
      if (itemIndex === -1) return prevItems;
      
      const newItems = [...prevItems];
      const [movedItem] = newItems.splice(itemIndex, 1);
      newItems.splice(toIndex, 0, movedItem);
      
      return newItems;
    });
  }, []);
  
  // Reset items to initial state
  const resetItems = useCallback(() => {
    setItems(initialItems);
  }, [initialItems]);
  
  return {
    items,
    draggedItem,
    isDragging,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    addItem,
    updateItem,
    removeItem,
    moveItem,
    resetItems,
    setItems
  };
};