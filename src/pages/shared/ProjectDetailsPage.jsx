import React from 'react'
import { Navigate, NavLink, useLocation, useNavigate, useParams } from 'react-router';
import NavBar from '../../components/layout/NavBar';
import { projects } from '../../data/projects';
import { ArrowLeft, BookOpen, Calendar, Clock, CodeXml, Download, Edit, FileText, Flag, GitPullRequestArrowIcon, Heart, Star, X, FileCheck } from 'lucide-react';
import { courses } from '../../data/courses';
import { instructors, students } from '../../data/users';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { ADMIN_TABS, ADMIN_TABS_SECONDARY, EMPLOYER_TABS, EMPLOYER_TABS_SECONDARY, STUDENT_TABS, STUDENT_TABS_SECONDARY, INSTRUCTOR_TABS, INSTRUCTOR_TABS_SECONDARY } from '../../data/tabs';
import ProjectDetailsCard from '../../components/ui/ProjectDetailsCard';
import BackButton from '../../components/ui/BackButton';
import FeedbackCard from '../../components/ui/FeedbackCard';

const ProjectDetailsPage = () => {
    const { user, login, logout } = useAuth();
    const tabs = user.role === 'student' ? STUDENT_TABS : user.role === 'employer' ? EMPLOYER_TABS : user.role === 'admin' ? ADMIN_TABS : user.role === 'instructor' ? INSTRUCTOR_TABS : [];
    const secondaryTabs = user.role === 'student' ? STUDENT_TABS_SECONDARY : user.role === 'employer' ? EMPLOYER_TABS_SECONDARY : user.role === 'admin' ? ADMIN_TABS_SECONDARY : user.role === 'instructor' ? INSTRUCTOR_TABS_SECONDARY : [];

    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const project = projects.find((proj) => proj.id === id);

    if (!project) {
        return (<Navigate to='/404' />);
    }

    const [isLiked, setIsLiked] = React.useState(user?.likedProjectsIds?.includes(id));
    const [isFlagged, setIsFlagged] = React.useState(project.isFlagged);
    const [showFlagModal, setShowFlagModal] = React.useState(false);
    const [page, setPage] = React.useState('overview');
    
    // Feedback state management
    const [generalFeedback, setGeneralFeedback] = React.useState(project.generalFeedback || []);
    const [projectTasks, setProjectTasks] = React.useState(project.tasks || []);
    const [thesisDrafts, setThesisDrafts] = React.useState(project.thesisDrafts || null);
    
    // Editing state
    const [editingGeneralIdx, setEditingGeneralIdx] = React.useState(null);
    const [editingTaskId, setEditingTaskId] = React.useState(null);
    const [editingTaskFeedbackIdx, setEditingTaskFeedbackIdx] = React.useState(null);
    const [editingDraftId, setEditingDraftId] = React.useState(null);
    const [editingDraftFeedbackIdx, setEditingDraftFeedbackIdx] = React.useState(null);
    
    const [editTextGeneral, setEditTextGeneral] = React.useState('');
    const [editRatingGeneral, setEditRatingGeneral] = React.useState(5);
    const [editTextTask, setEditTextTask] = React.useState('');
    const [editTextDraft, setEditTextDraft] = React.useState('');

    const isBachelor = project.courseId === 'c5';
    const projectTypeClassName = isBachelor ? 'text-xs font-semibold py-0.5 px-2.5 mr-auto rounded-full bg-[#E0E7FF] text-[#372AAC]' 
                                            : 'text-xs font-semibold py-0.5 px-2.5 mr-auto rounded-full bg-[#F1F5F9] text-[#0F172B]';
    const activeClassName = 'cursor-pointer pb-[13px] text-[#432DD7] text-sm font-bold border-b-3 border-[#432DD7] transition-colors duration-150';
    const inactiveClassName = 'cursor-pointer pb-4 text-[#6A7282] text-sm hover:text-[#432DD7] transition-colors duration-150';
    

    const getEmbedUrl = (url) => {
        if (!url) return null
        try {
            const parsed = new URL(url)
            let videoId = null

            if (parsed.hostname === 'youtu.be') {
                videoId = parsed.pathname.slice(1)
            } else if (parsed.hostname.includes('youtube.com')) {
                videoId = parsed.searchParams.get('v')
            }

            return videoId ? `https://www.youtube.com/embed/${videoId}` : null
        } catch {
            return null
        }
    }

    // Feedback handlers
    const handleAddGeneralFeedback = (comment, rating) => {
        const newFeedback = {
            instructorId: user.id,
            comment,
            createdAt: new Date().toISOString().split('T')[0],
            rating
        };
        setGeneralFeedback([...generalFeedback, newFeedback]);
    };

    const handleEditGeneralFeedback = (index, newComment, newRating) => {
        const updated = [...generalFeedback];
        updated[index] = { ...updated[index], comment: newComment, rating: newRating };
        setGeneralFeedback(updated);
    };

    const handleDeleteGeneralFeedback = (index) => {
        setGeneralFeedback(generalFeedback.filter((_, i) => i !== index));
    };

    const handleAddTaskFeedback = (taskId, comment) => {
        const updated = projectTasks.map(task => {
            if (task.id === taskId) {
                return {
                    ...task,
                    instructorComments: [
                        ...task.instructorComments,
                        { instructorId: user.id, comment, createdAt: new Date().toISOString().split('T')[0] }
                    ]
                };
            }
            return task;
        });
        setProjectTasks(updated);
    };

    const handleEditTaskFeedback = (taskId, index, newComment) => {
        const updated = projectTasks.map(task => {
            if (task.id === taskId) {
                const updatedComments = [...task.instructorComments];
                updatedComments[index] = { ...updatedComments[index], comment: newComment };
                return { ...task, instructorComments: updatedComments };
            }
            return task;
        });
        setProjectTasks(updated);
    };

    const handleDeleteTaskFeedback = (taskId, index) => {
        const updated = projectTasks.map(task => {
            if (task.id === taskId) {
                return {
                    ...task,
                    instructorComments: task.instructorComments.filter((_, i) => i !== index)
                };
            }
            return task;
        });
        setProjectTasks(updated);
    };

    const handleAddDraftFeedback = (draftId, comment) => {
        const updated = thesisDrafts.map(draft => {
            if (draft.id === draftId) {
                return {
                    ...draft,
                    instructorFeedback: [
                        ...draft.instructorFeedback,
                        { instructorId: user.id, comment, createdAt: new Date().toISOString().split('T')[0] }
                    ]
                };
            }
            return draft;
        });
        setThesisDrafts(updated);
    };

    const handleEditDraftFeedback = (draftId, index, newComment) => {
        const updated = thesisDrafts.map(draft => {
            if (draft.id === draftId) {
                const updatedFeedback = [...draft.instructorFeedback];
                updatedFeedback[index] = { ...updatedFeedback[index], comment: newComment };
                return { ...draft, instructorFeedback: updatedFeedback };
            }
            return draft;
        });
        setThesisDrafts(updated);
    };

    const handleDeleteDraftFeedback = (draftId, index) => {
        const updated = thesisDrafts.map(draft => {
            if (draft.id === draftId) {
                return {
                    ...draft,
                    instructorFeedback: draft.instructorFeedback.filter((_, i) => i !== index)
                };
            }
            return draft;
        });
        setThesisDrafts(updated);
    };

    // Feedback Form Components
    const GeneralFeedbackForm = ({ onSubmit }) => {
        const [comment, setComment] = React.useState('');
        const [rating, setRating] = React.useState(5);

        const handleSubmit = () => {
            if (!comment.trim()) return;
            onSubmit(comment, rating);
            setComment('');
            setRating(5);
        };

        return (
            <div className='flex flex-col gap-3 p-4 bg-white border border-[#E2E8F0] rounded-lg'>
                <textarea
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    rows={3}
                    placeholder='Write your feedback…'
                    className='w-full px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm outline-none focus:border-[#432DD7] focus:ring-2 focus:ring-[#432DD7]/20 transition-all duration-200 resize-none'
                />
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                        <span className='text-xs text-[#62748E]'>Rating:</span>
                        <div className='flex gap-1'>
                            {[1, 2, 3, 4, 5].map(star => (
                                <button
                                    key={star}
                                    onClick={() => setRating(star)}
                                    className='focus:outline-none transition-colors'
                                >
                                    <Star
                                        className={`w-4 h-4 cursor-pointer ${
                                            star <= rating ? 'fill-[#F0B100] text-[#F0B100]' : 'text-[#D0D5DD]'
                                        }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={!comment.trim()}
                        className='px-4 py-2 bg-[#432DD7] text-white text-sm font-medium rounded-lg hover:bg-[#3524b5] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        Add Feedback
                    </button>
                </div>
            </div>
        );
    };

    const TaskFeedbackForm = ({ taskId, onSubmit }) => {
        const [comment, setComment] = React.useState('');

        const handleSubmit = () => {
            if (!comment.trim()) return;
            onSubmit(comment);
            setComment('');
        };

        return (
            <div className='flex flex-col gap-2 p-3 bg-white border border-[#E2E8F0] rounded-lg mt-2'>
                <textarea
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    rows={2}
                    placeholder='Add feedback on this task…'
                    className='w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm outline-none focus:border-[#432DD7] focus:ring-2 focus:ring-[#432DD7]/20 transition-all duration-200 resize-none'
                />
                <button
                    onClick={handleSubmit}
                    disabled={!comment.trim()}
                    className='self-end px-3 py-1.5 bg-[#432DD7] text-white text-xs font-medium rounded-lg hover:bg-[#3524b5] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                >
                    Add Feedback
                </button>
            </div>
        );
    };

    const DraftFeedbackForm = ({ draftId, onSubmit }) => {
        const [comment, setComment] = React.useState('');

        const handleSubmit = () => {
            if (!comment.trim()) return;
            onSubmit(comment);
            setComment('');
        };

        return (
            <div className='flex flex-col gap-2 p-3 bg-white border border-[#E2E8F0] rounded-lg mt-2'>
                <textarea
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    rows={2}
                    placeholder='Add feedback on this draft…'
                    className='w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm outline-none focus:border-[#432DD7] focus:ring-2 focus:ring-[#432DD7]/20 transition-all duration-200 resize-none'
                />
                <button
                    onClick={handleSubmit}
                    disabled={!comment.trim()}
                    className='self-end px-3 py-1.5 bg-[#432DD7] text-white text-xs font-medium rounded-lg hover:bg-[#3524b5] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                >
                    Add Feedback
                </button>
            </div>
        );
    };

    return (
        <DashboardLayout tabs={tabs} secondaryTabs={secondaryTabs} childrenClassName='px-8 py-4'>
            <BackButton />
            <ProjectDetailsCard project={project} isLiked={isLiked} setIsLiked={setIsLiked} isFlagged={isFlagged} setIsFlagged={setIsFlagged} showFlagModal={showFlagModal} setShowFlagModal={setShowFlagModal} />
            
            <div className='flex gap-8 border-b border-[#E2E8F0] mt-4'>
                <button className={(page === 'overview' ? activeClassName : inactiveClassName)} onClick={() => setPage('overview')}>
                    Overview
                </button>
                {user && user.role === 'instructor' && project.instructorIds.includes(user.id) && (
                    <button className={(page === 'feedback' ? activeClassName : inactiveClassName)} onClick={() => setPage('feedback')}>
                        Feedback
                    </button>
                )}
            </div>
            
            <div key={location.window} className='slide-in flex gap-10 mt-6 mx-2'>
              <div className='flex flex-3 flex-col'>
                  {page === 'overview' && (
                    <>
                      <p className='text-lg text-navy font-semibold'>
                          Description
                      </p>
                      <p className='text-sm text-[#364153] leading-relaxed mt-4'>
                          {project.description || 'No description available.'}
                      </p>

                      <p className='text-lg text-navy font-semibold mt-8'>
                          Demo Video
                      </p>
                      {project.demoVideo && (
                          <iframe
                              src={getEmbedUrl(project.demoVideo)}
                              className='w-full aspect-video rounded-2xl mt-8'
                              frameBorder='0'
                              allow='accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                              allowFullScreen
                          />
                      )}

                      {!project.demoVideo && (
                          <div className='w-full aspect-video rounded-2xl mt-8 bg-[#E2E8F0] flex items-center justify-center'>
                              <p className='text-sm text-[#62748E]'>No demo video available.</p>
                          </div>
                      )}
                    </>
                  )}

                  {page === 'feedback' && (
                    <>
                      {/* General Feedback Section */}
                      <div className='flex flex-col gap-4 mb-8'>
                        <div>
                          <h2 className='text-lg font-semibold text-navy mb-1'>General Feedback</h2>
                          {generalFeedback.length === 0 ? (
                            <p className='text-sm text-[#62748E] mb-4'>No feedback yet.</p>
                          ) : (
                            <div className='flex flex-col gap-3 mb-4'>
                              {generalFeedback.map((feedback, idx) => {
                                const instructor = instructors.find(i => i.id === feedback.instructorId);
                                const isOwn = feedback.instructorId === user?.id;
                                const isEditing = editingGeneralIdx === idx;

                                if (isEditing) {
                                  return (
                                    <div key={idx} className='flex flex-col gap-3 p-4 bg-white border border-[#432DD7] rounded-lg'>
                                      <textarea
                                        value={editTextGeneral}
                                        onChange={e => setEditTextGeneral(e.target.value)}
                                        rows={3}
                                        className='w-full px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm outline-none focus:border-[#432DD7] focus:ring-2 focus:ring-[#432DD7]/20 transition-all duration-200 resize-none'
                                      />
                                      <div className='flex items-center justify-between'>
                                        <div className='flex items-center gap-2'>
                                          <span className='text-xs text-[#62748E]'>Rating:</span>
                                          <div className='flex gap-1'>
                                            {[1, 2, 3, 4, 5].map(star => (
                                              <button
                                                key={star}
                                                onClick={() => setEditRatingGeneral(star)}
                                                className='focus:outline-none transition-colors'
                                              >
                                                <Star
                                                  className={`w-4 h-4 cursor-pointer ${
                                                    star <= editRatingGeneral ? 'fill-[#F0B100] text-[#F0B100]' : 'text-[#D0D5DD]'
                                                  }`}
                                                />
                                              </button>
                                            ))}
                                          </div>
                                        </div>
                                        <div className='flex gap-2'>
                                          <button
                                            onClick={() => setEditingGeneralIdx(null)}
                                            className='px-3 py-1.5 border border-[#E2E8F0] text-xs rounded-lg hover:bg-[#F1F5F9] transition-colors cursor-pointer'
                                          >
                                            Cancel
                                          </button>
                                          <button
                                            onClick={() => {
                                              handleEditGeneralFeedback(idx, editTextGeneral, editRatingGeneral);
                                              setEditingGeneralIdx(null);
                                            }}
                                            className='px-3 py-1.5 bg-[#432DD7] text-white text-xs rounded-lg hover:bg-[#3524b5] transition-colors cursor-pointer'
                                          >
                                            Save
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                }

                                return (
                                  <div key={idx} className='flex flex-col gap-2 p-4 bg-white border border-[#E2E8F0] rounded-lg'>
                                    <div className='flex items-center justify-between'>
                                      <div className='flex items-center gap-3'>
                                        <img src={instructor?.avatar} alt={instructor?.firstName} className='w-8 h-8 rounded-full object-cover' />
                                        <div>
                                          <p className='text-sm font-semibold text-[#432DD7]'>{instructor?.firstName} {instructor?.lastName}</p>
                                          <p className='text-xs text-[#62748E]'>{feedback.createdAt}</p>
                                        </div>
                                      </div>
                                      <div className='flex items-center gap-2'>
                                        <div className='flex gap-0.5'>
                                          {[1, 2, 3, 4, 5].map(star => (
                                            <Star
                                              key={star}
                                              className={`w-4 h-4 ${
                                                star <= feedback.rating ? 'fill-[#F0B100] text-[#F0B100]' : 'text-[#D0D5DD]'
                                              }`}
                                            />
                                          ))}
                                        </div>
                                        {user?.role === 'instructor' && isOwn && (
                                          <div className='flex gap-1 ml-2'>
                                            <button
                                              onClick={() => {
                                                setEditingGeneralIdx(idx);
                                                setEditTextGeneral(feedback.comment);
                                                setEditRatingGeneral(feedback.rating);
                                              }}
                                              className='p-1 text-[#62748E] hover:text-[#432DD7] transition-colors cursor-pointer'
                                            >
                                              <Edit className='w-3.5 h-3.5' />
                                            </button>
                                            <button
                                              onClick={() => handleDeleteGeneralFeedback(idx)}
                                              className='p-1 text-[#62748E] hover:text-red-500 transition-colors cursor-pointer'
                                            >
                                              <X className='w-3.5 h-3.5' />
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    <p className='text-sm text-[#364153]'>{feedback.comment}</p>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {user?.role === 'instructor' && generalFeedback.length === 0 && (
                            <GeneralFeedbackForm onSubmit={handleAddGeneralFeedback} />
                          )}
                        </div>
                      </div>

                      {/* Task Feedback Section */}
                      <div className='flex flex-col gap-4 mb-8'>
                        <h2 className='text-lg font-semibold text-navy mb-1'>Task Feedback</h2>
                        {projectTasks.length === 0 ? (
                          <p className='text-sm text-[#62748E]'>No tasks available.</p>
                        ) : (
                          <div className='flex flex-col gap-3'>
                            {projectTasks.map(task => {
                              const getStatusColor = (status) => {
                                switch(status) {
                                  case 'completed':
                                    return 'bg-[#DCFCE7] text-[#166534]';
                                  case 'in progress':
                                    return 'bg-[#E0E7FF] text-[#3730A3]';
                                  case 'pending':
                                    return 'bg-[#FEF3C7] text-[#92400E]';
                                  default:
                                    return 'bg-[#F3F4F6] text-[#4B5563]';
                                }
                              };

                              return (
                              <div key={task.id} className='flex flex-col gap-3 p-4 border border-[#E2E8F0] rounded-lg bg-white'>
                                <div>
                                  <div className='flex items-center gap-2 mb-2'>
                                    <h3 className='text-sm font-semibold text-navy'>{task.title}</h3>
                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${getStatusColor(task.status)}`}>
                                      {task.status}
                                    </span>
                                  </div>
                                  <p className='text-xs text-[#62748E] mb-3'>{task.description}</p>
                                </div>
                                
                                {task.instructorComments.length === 0 ? (
                                  <p className='text-xs text-[#62748E]'>No feedback on this task yet.</p>
                                ) : (
                                  <div className='flex flex-col gap-2'>
                                    {task.instructorComments.map((comment, idx) => {
                                      const instructor = instructors.find(i => i.id === comment.instructorId);
                                      const isOwn = comment.instructorId === user?.id;
                                      const isEditing = editingTaskId === task.id && editingTaskFeedbackIdx === idx;

                                      if (isEditing) {
                                        return (
                                          <div key={idx} className='flex flex-col gap-2 p-3 bg-white border border-[#432DD7] rounded-lg'>
                                            <textarea
                                              value={editTextTask}
                                              onChange={e => setEditTextTask(e.target.value)}
                                              rows={2}
                                              className='w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm outline-none focus:border-[#432DD7] focus:ring-2 focus:ring-[#432DD7]/20 transition-all duration-200 resize-none'
                                            />
                                            <div className='flex gap-2 justify-end'>
                                              <button
                                                onClick={() => setEditingTaskId(null)}
                                                className='px-2 py-1 border border-[#E2E8F0] text-xs rounded-lg hover:bg-[#F1F5F9] transition-colors cursor-pointer'
                                              >
                                                Cancel
                                              </button>
                                              <button
                                                onClick={() => {
                                                  handleEditTaskFeedback(task.id, idx, editTextTask);
                                                  setEditingTaskId(null);
                                                  setEditingTaskFeedbackIdx(null);
                                                }}
                                                className='px-2 py-1 bg-[#432DD7] text-white text-xs rounded-lg hover:bg-[#3524b5] transition-colors cursor-pointer'
                                              >
                                                Save
                                              </button>
                                            </div>
                                          </div>
                                        );
                                      }

                                      return (
                                        <div key={idx} className='flex flex-col gap-2 p-3 bg-white border border-[#E2E8F0] rounded-lg'>
                                          <div className='flex items-center justify-between'>
                                            <div className='flex items-center gap-2'>
                                              <img src={instructor?.avatar} alt={instructor?.firstName} className='w-6 h-6 rounded-full object-cover' />
                                              <div>
                                                <p className='text-xs font-semibold text-[#432DD7]'>{instructor?.firstName} {instructor?.lastName}</p>
                                                <p className='text-xs text-[#62748E]'>{comment.createdAt}</p>
                                              </div>
                                            </div>
                                            {user?.role === 'instructor' && isOwn && (
                                              <div className='flex gap-1'>
                                                <button
                                                  onClick={() => {
                                                    setEditingTaskId(task.id);
                                                    setEditingTaskFeedbackIdx(idx);
                                                    setEditTextTask(comment.comment);
                                                  }}
                                                  className='p-0.5 text-[#62748E] hover:text-[#432DD7] transition-colors cursor-pointer'
                                                >
                                                  <Edit className='w-3 h-3' />
                                                </button>
                                                <button
                                                  onClick={() => handleDeleteTaskFeedback(task.id, idx)}
                                                  className='p-0.5 text-[#62748E] hover:text-red-500 transition-colors cursor-pointer'
                                                >
                                                  <X className='w-3 h-3' />
                                                </button>
                                              </div>
                                            )}
                                          </div>
                                          <p className='text-sm text-[#364153]'>{comment.comment}</p>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}

                                {user?.role === 'instructor' && !task.instructorComments.some(c => c.instructorId === user.id) && (
                                  <TaskFeedbackForm taskId={task.id} onSubmit={(comment) => handleAddTaskFeedback(task.id, comment)} />
                                )}
                              </div>
                            );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Draft Feedback Section - Only for Bachelor Projects */}
                      {isBachelor && thesisDrafts && (
                        <div className='flex flex-col gap-4'>
                          <h2 className='text-lg font-semibold text-navy mb-1'>Thesis Drafts</h2>
                          {thesisDrafts.length === 0 ? (
                            <p className='text-sm text-[#62748E]'>No drafts available.</p>
                          ) : (
                            <div className='flex flex-col gap-3'>
                              {(thesisDrafts.some(d => d.isFinal) ? thesisDrafts.filter(d => d.isFinal) : thesisDrafts).map(draft => {
                                const isFinalDraft = draft.isFinal;
                                const hasExistingFeedback = draft.instructorFeedback && draft.instructorFeedback.length > 0;
                                const userHasFeedback = draft.instructorFeedback?.some(f => f.instructorId === user?.id);

                                return (
                                  <div key={draft.id} className='flex flex-col gap-3 p-4 border border-[#E2E8F0] rounded-lg bg-white'>
                                    <div className='flex items-center gap-3'>
                                      <FileText className='w-5 h-5 text-[#432DD7]' />
                                      <div className='flex-1'>
                                        <h3 className='text-sm font-semibold text-navy flex items-center gap-2'>
                                          {draft.name}
                                          {isFinalDraft && (
                                            <span className='flex items-center gap-1 text-xs bg-[#E0E7FF] text-[#372AAC] px-2 py-0.5 rounded-full'>
                                              <FileCheck className='w-3 h-3' /> Final
                                            </span>
                                          )}
                                        </h3>
                                        <p className='text-xs text-[#62748E]'>Uploaded on {draft.uploadedAt}</p>
                                      </div>
                                      <a href={draft.url} target='_blank' rel='noopener noreferrer' className='text-[#432DD7] hover:text-[#3524b5] transition-colors'>
                                        <Download className='w-4 h-4' />
                                      </a>
                                    </div>

                                    {isFinalDraft ? (
                                      <div className='flex items-center gap-2 text-xs text-[#432DD7] bg-[#E0E7FF] p-2 rounded-lg'>
                                        <FileCheck className='w-4 h-4' />
                                        This is the final thesis draft.
                                      </div>
                                    ) : (
                                      <>
                                        {!hasExistingFeedback ? (
                                          <p className='text-xs text-[#62748E]'>No feedback on this draft yet.</p>
                                        ) : (
                                          <div className='flex flex-col gap-2'>
                                            {draft.instructorFeedback.map((feedback, idx) => {
                                              const instructor = instructors.find(i => i.id === feedback.instructorId);
                                              const isOwn = feedback.instructorId === user?.id;
                                              const isEditing = editingDraftId === draft.id && editingDraftFeedbackIdx === idx;

                                              if (isEditing) {
                                                return (
                                                  <div key={idx} className='flex flex-col gap-2 p-3 bg-white border border-[#432DD7] rounded-lg'>
                                                    <textarea
                                                      value={editTextDraft}
                                                      onChange={e => setEditTextDraft(e.target.value)}
                                                      rows={2}
                                                      className='w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm outline-none focus:border-[#432DD7] focus:ring-2 focus:ring-[#432DD7]/20 transition-all duration-200 resize-none'
                                                    />
                                                    <div className='flex gap-2 justify-end'>
                                                      <button
                                                        onClick={() => setEditingDraftId(null)}
                                                        className='px-2 py-1 border border-[#E2E8F0] text-xs rounded-lg hover:bg-[#F1F5F9] transition-colors cursor-pointer'
                                                      >
                                                        Cancel
                                                      </button>
                                                      <button
                                                        onClick={() => {
                                                          handleEditDraftFeedback(draft.id, idx, editTextDraft);
                                                          setEditingDraftId(null);
                                                          setEditingDraftFeedbackIdx(null);
                                                        }}
                                                        className='px-2 py-1 bg-[#432DD7] text-white text-xs rounded-lg hover:bg-[#3524b5] transition-colors cursor-pointer'
                                                      >
                                                        Save
                                                      </button>
                                                    </div>
                                                  </div>
                                                );
                                              }

                                              return (
                                                <div key={idx} className='flex flex-col gap-2 p-3 bg-white border border-[#E2E8F0] rounded-lg'>
                                                  <div className='flex items-center justify-between'>
                                                    <div className='flex items-center gap-2'>
                                                      <img src={instructor?.avatar} alt={instructor?.firstName} className='w-6 h-6 rounded-full object-cover' />
                                                      <div>
                                                        <p className='text-xs font-semibold text-[#432DD7]'>{instructor?.firstName} {instructor?.lastName}</p>
                                                        <p className='text-xs text-[#62748E]'>{feedback.createdAt}</p>
                                                      </div>
                                                    </div>
                                                    {user?.role === 'instructor' && isOwn && (
                                                      <div className='flex gap-1'>
                                                        <button
                                                          onClick={() => {
                                                            setEditingDraftId(draft.id);
                                                            setEditingDraftFeedbackIdx(idx);
                                                            setEditTextDraft(feedback.comment);
                                                          }}
                                                          className='p-0.5 text-[#62748E] hover:text-[#432DD7] transition-colors cursor-pointer'
                                                        >
                                                          <Edit className='w-3 h-3' />
                                                        </button>
                                                        <button
                                                          onClick={() => handleDeleteDraftFeedback(draft.id, idx)}
                                                          className='p-0.5 text-[#62748E] hover:text-red-500 transition-colors cursor-pointer'
                                                        >
                                                          <X className='w-3 h-3' />
                                                        </button>
                                                      </div>
                                                    )}
                                                  </div>
                                                  <p className='text-sm text-[#364153]'>{feedback.comment}</p>
                                                </div>
                                              );
                                            })}
                                          </div>
                                        )}

                                        {user?.role === 'instructor' && !userHasFeedback && (
                                          <DraftFeedbackForm draftId={draft.id} onSubmit={(comment) => handleAddDraftFeedback(draft.id, comment)} />
                                        )}
                                      </>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
              </div>
              
              <div className='flex flex-1 flex-col'>
                  <span className='text-xs font-bold text-[#99A1AF] uppercase'>
                      Project Details
                  </span>
                  <div className='flex flex-col items-start mt-3 gap-3'>
                      <div className='flex items-start gap-3'>
                          <BookOpen className='size-4 font-bold text-[#99A1AF]' />
                          <div className='flex flex-col'>
                              <p className='text-xs text-[#6A7282]'>Course</p>
                              <p className='text-sm text-navy font-medium'>
                                  {courses.find(c => c.id === project.courseId)?.code || 'N/A'}: {courses.find(c => c.id === project.courseId)?.name || 'N/A'}
                              </p>
                          </div>
                      </div>
                      <div className='flex items-start gap-3'>
                          <Clock className='size-4 font-bold text-[#99A1AF]' />
                          <div className='flex flex-col'>
                              <p className='text-xs text-[#6A7282]'>Semester</p>
                              <p className='text-sm text-navy font-medium'>
                                  {project.semester}
                              </p>
                          </div>
                      </div>
                      <div className='flex items-start gap-3'>
                          <Star className='size-4 font-bold text-[#F0B100] fill-[#F0B100]' />
                          <div className='flex flex-col'>
                              <p className='text-xs text-[#6A7282]'>Rating</p>
                              <p className='text-sm text-navy font-medium'>
                                  {generalFeedback?.[0]?.rating || 'N/A'}
                              </p>
                          </div>
                      </div>
                  </div>
                  {isBachelor && (
                        <>
                            <div className='bg-[#E2E8F0] w-full h-px my-8' />
                            <span className='text-xs font-bold text-[#99A1AF] uppercase'>
                                Final Thesis
                            </span>
                          {thesisDrafts && thesisDrafts.some(d => d.isFinal) ? (
                            (() => {
                              const finalThesis = thesisDrafts.find(d => d.isFinal);
                              return (
                                <div className='flex flex-col gap-3 p-4 border border-[#E2E8F0] rounded-lg bg-white mt-4'>
                                  <div className='flex items-center gap-3'>
                                    <FileText className='w-5 h-5 text-[#432DD7]' />
                                    <div className='flex-1'>
                                      <h3 className='text-sm font-semibold text-navy flex items-center gap-2'>
                                        {finalThesis.name}
                                        <span className='flex items-center gap-1 text-xs bg-[#E0E7FF] text-[#372AAC] px-2 py-0.5 rounded-full'>
                                          <FileCheck className='w-3 h-3' /> Final
                                        </span>
                                      </h3>
                                      <p className='text-xs text-[#62748E]'>Uploaded on {finalThesis.uploadedAt}</p>
                                    </div>
                                    <a href={finalThesis.url} target='_blank' rel='noopener noreferrer' className='text-[#432DD7] hover:text-[#3524b5] transition-colors'>
                                      <Download className='w-4 h-4' />
                                    </a>
                                  </div>
                                </div>
                              );
                            })()
                          ) : (
                            <p className='text-sm text-[#62748E] italic mt-4'>No final thesis was picked yet.</p>
                          )}
                        </>
                      )}
                      
                  <div className='bg-[#E2E8F0] w-full h-px my-8' />
                  <span className='text-xs font-bold text-[#99A1AF] uppercase'>
                      Technologies
                  </span>
                  <div className='flex flex-wrap mt-3 gap-2'>
                      {project.languages.map((lang) => (
                          <span key={lang} className='text-xs font-medium text-[#364153] bg-[#F3F4F6] py-1 px-2 rounded-full'>
                              {lang}
                          </span>
                      ))}
                  </div>

                  <div className='bg-[#E2E8F0] w-full h-px my-8' />
                  <span className='text-xs font-bold text-[#99A1AF] uppercase'>
                      Team
                  </span>
                  <div className='flex flex-col mt-3 gap-3'>
                      <div className='flex items-center gap-3'>
                          <img src={students.find(s => s.id === project.creatorId)?.avatar} alt={`${students.find(s => s.id === project.creatorId)?.firstName} ${students.find(s => s.id === project.creatorId)?.lastName}`} className='size-8 rounded-full object-cover' />
                          <div className='flex flex-col'>
                              <p className='text-sm text-navy font-medium'>
                                  {students.find(s => s.id === project.creatorId)?.firstName} {students.find(s => s.id === project.creatorId)?.lastName}
                              </p>
                              <p className='text-[10px] text-[#6A7282]'>
                                  OWNER
                              </p>
                          </div>
                      </div>

                      {project.collaborators.map((collaboratorId) => {
                          const collaborator = students.find(s => s.id === collaboratorId) || instructors.find(i => i.id === collaboratorId);
                          if (!collaborator) return null;
                          return (
                              <div key={collaboratorId} className='flex items-center gap-3'>
                                  <img src={collaborator.avatar} alt={`${collaborator.firstName} ${collaborator.lastName}`} className='size-8 rounded-full object-cover' />
                                  <div className='flex flex-col'>
                                      <p className='text-sm text-navy font-medium'>
                                          {collaborator.firstName} {collaborator.lastName}
                                      </p>
                                      <p className='text-[10px] text-[#6A7282]'>
                                          MEMBER
                                      </p>
                                  </div>
                              </div>
                          )
                      })}
                  </div>
                  
                  <div className='bg-[#E2E8F0] w-full h-px my-8' />
                  <span className='text-xs font-bold text-[#99A1AF] uppercase'>
                      Supervised By
                  </span>
                  <div className='flex items-center mt-3 gap-3'>
                      {project.instructorIds.map((instructorId) => {
                          const instructor = instructors.find(i => i.id === instructorId);
                          if (!instructor) return null;
                          return (
                              <div key={instructorId} className='flex items-center gap-3'>
                                  <img src={instructor.avatar} alt={`${instructor.firstName} ${instructor.lastName}`} className='size-8 rounded-full object-cover' />
                                  <div className='flex flex-col'>
                                      <p className='text-sm text-navy font-medium'>
                                          {instructor.firstName} {instructor.lastName}
                                      </p>
                                      <p className='text-[10px] text-[#6A7282]'>
                                          INSTRUCTOR
                                      </p>
                                  </div>
                              </div>
                          )
                      })}
                  </div>
              </div>
          </div>
        </DashboardLayout>
    )
}

export default ProjectDetailsPage