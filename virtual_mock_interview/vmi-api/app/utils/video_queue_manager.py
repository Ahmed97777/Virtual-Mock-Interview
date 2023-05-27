import threading
from queue import Queue
import logging


class VideoQueueManager:
    def __init__(self, video_analyzer):
        self.video_queue = Queue()
        self.video_analyzer = video_analyzer
        self.processing_lock = threading.Lock()
        self.worker_thread = threading.Thread(target=self.process_video_queue)
        self.worker_thread.start()

    def add_video(self, interview_id, video_filename):
        self.video_queue.put((interview_id, video_filename))
    
    def process_video_queue(self):
        while True:
            try:
                # Get video information from the queue
                interview_id, video_id = self.video_queue.get()
                # Acquire the lock to ensure exclusive access to the processing function
                self.processing_lock.acquire()
                # Analyze the video.
                self.video_analyzer.analyze_video(interview_id, video_id)
                
                # Release the lock to allow other videos to be processed
                self.processing_lock.release()
                # Mark the video as done.
                self.video_queue.task_done()
            except Exception as e:
                logging.exception("Error processing video: {}".format(e))

    def __del__(self):
        # Wait for the worker thread to finish processing the remaining videos
        self.video_queue.join()
        # Terminate the worker thread
        self.worker_thread.join()
    