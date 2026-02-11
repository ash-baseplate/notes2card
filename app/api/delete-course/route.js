import { db } from '@/configs/db';
import { auth, currentUser } from '@clerk/nextjs/server';
import {
  Chapter_Notes_TABLE,
  STUDY_MATERIAL_TABLE,
  STUDY_TYPE_CONTENT_TABLE,
} from '@/configs/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { inngest } from '@/inngest/client';

export async function DELETE(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await currentUser();
    const userEmail =
      user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress;

    const { courseId } = await req.json();

    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }

    // Verify user owns this course before deletion
    const course = await db
      .select()
      .from(STUDY_MATERIAL_TABLE)
      .where(eq(STUDY_MATERIAL_TABLE.courseId, courseId))
      .limit(1);

    if (!course.length || course[0].createBy !== userEmail) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Delete related data from all tables
    await db.delete(Chapter_Notes_TABLE).where(eq(Chapter_Notes_TABLE.courseId, courseId));
    await db
      .delete(STUDY_TYPE_CONTENT_TABLE)
      .where(eq(STUDY_TYPE_CONTENT_TABLE.courseId, courseId));
    await db.delete(STUDY_MATERIAL_TABLE).where(eq(STUDY_MATERIAL_TABLE.courseId, courseId));

    // Trigger inngest event for post-deletion processing
    await inngest.send({
      name: 'course/delete.completed',
      data: { courseId },
    });

    return NextResponse.json({ success: true, message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 });
  }
}
