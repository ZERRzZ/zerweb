import { MenuOutlined } from '@ant-design/icons';
import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Table, TableProps } from "antd";
import React, { useMemo } from 'react';

interface SortRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  'data-row-key': string;
}

const SortRow = (props: SortRowProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: props['data-row-key'],
  });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
    transition,
    cursor: 'move',
    ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
  };

  return <tr {...props} ref={setNodeRef} style={style} {...attributes} {...listeners} />;
};

const GripSortRow = ({ children, ...props }: SortRowProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props['data-row-key'],
  });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 })?.replace(
      /translate3d\(([^,]+),/,
      'translate3d(0,',
    ),
    transition,
    ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
  };

  return (
    <tr {...props} ref={setNodeRef} style={style} {...attributes}>
      {React.Children.map(children, (child) => {
        if ((child as React.ReactElement).key === 'sort') {
          return React.cloneElement(child as React.ReactElement, {
            children: (
              <MenuOutlined
                ref={setActivatorNodeRef}
                style={{ touchAction: 'none', cursor: 'move' }}
                {...listeners}
              />
            ),
          });
        }
        return child;
      })}
    </tr>
  );
};

interface MyDragSortTableProps extends TableProps<any> {
  sortChange?: (activeIndex, overIndex, newDataSource) => void;
  sortMode?: 'default' | 'grip';
}

const MyDragSortTable: React.FC<MyDragSortTableProps> = (props) => {

  const tableProps = useMemo(() => {
    if (props) {
      let newProps = { ...props };
      if (props.sortMode === 'grip' && props.columns) {
        newProps.columns = [...props.columns];
        newProps.columns.splice(0, 0, {
          key: 'sort',
          width: 50
        });
      }
      newProps.sortChange = undefined;
      delete newProps.sortMode;
      return newProps;
    }
    return undefined;
  }, [props.columns, props.sortMode])

  const tableRow = useMemo(() => {
    return props.sortMode === 'grip' ? GripSortRow : SortRow;
  }, [props.sortMode])

  const rowKey = props.rowKey as string || 'key';
  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      let dataSource = props.dataSource?.slice(0) || [];
      const activeIndex = dataSource.findIndex((item) => item[rowKey] === active.id);
      const overIndex = dataSource.findIndex((item) => item[rowKey] === over?.id);
      props.sortChange && props.sortChange(activeIndex, overIndex, arrayMove(dataSource, activeIndex, overIndex));
    }
  };
  return <DndContext onDragEnd={onDragEnd}>
    <SortableContext
      // rowKey array
      items={props.dataSource?.map((item) => item[rowKey]) || []}
      strategy={verticalListSortingStrategy}
    >
      <Table
        components={{
          body: {
            row: tableRow,
          },
        }}
        {...tableProps}
      />
    </SortableContext>
  </DndContext>
}
export default MyDragSortTable;