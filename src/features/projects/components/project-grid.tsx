'use client';

import React from 'react';
import { Project } from '../types/project.types';
import { ProjectCard } from './project-card';
import { StaggerList, StaggerItem } from '@/src/shared/animations';

interface ProjectGridProps {
  projects: Project[];
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
}

export function ProjectGrid({ projects, onEdit, onDelete }: ProjectGridProps) {
  return (
    <StaggerList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {projects.map((project) => (
        <StaggerItem key={project.id}>
          <ProjectCard project={project} onEdit={onEdit} onDelete={onDelete} />
        </StaggerItem>
      ))}
    </StaggerList>
  );
}
