from django.core.management.base import BaseCommand
from django.conf import settings
from pymongo import MongoClient

class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        client = MongoClient('localhost', 27017)
        db_name = settings.DATABASES['default']['NAME']
        print(f"DEBUG: db_name from settings = {db_name} ({type(db_name)})")
        db = client[str(db_name)]

        # Collections
        users = db.users
        teams = db.teams
        activities = db.activities
        leaderboard = db.leaderboard
        workouts = db.workouts

        # Clear existing data
        users.delete_many({})
        teams.delete_many({})
        activities.delete_many({})
        leaderboard.delete_many({})
        workouts.delete_many({})

        # Ensure unique index on email
        users.create_index('email', unique=True)

        # Teams
        marvel = {'name': 'Team Marvel'}
        dc = {'name': 'Team DC'}
        marvel_id = teams.insert_one(marvel).inserted_id
        dc_id = teams.insert_one(dc).inserted_id

        # Users
        user_data = [
            {'name': 'Iron Man', 'email': 'ironman@marvel.com', 'team_id': marvel_id},
            {'name': 'Captain America', 'email': 'cap@marvel.com', 'team_id': marvel_id},
            {'name': 'Spider-Man', 'email': 'spiderman@marvel.com', 'team_id': marvel_id},
            {'name': 'Superman', 'email': 'superman@dc.com', 'team_id': dc_id},
            {'name': 'Batman', 'email': 'batman@dc.com', 'team_id': dc_id},
            {'name': 'Wonder Woman', 'email': 'wonderwoman@dc.com', 'team_id': dc_id},
        ]
        user_ids = users.insert_many(user_data).inserted_ids

        # Activities
        activity_data = [
            {'user_id': user_ids[0], 'type': 'run', 'distance': 5, 'duration': 30},
            {'user_id': user_ids[1], 'type': 'cycle', 'distance': 20, 'duration': 60},
            {'user_id': user_ids[2], 'type': 'swim', 'distance': 1, 'duration': 40},
            {'user_id': user_ids[3], 'type': 'run', 'distance': 10, 'duration': 50},
            {'user_id': user_ids[4], 'type': 'cycle', 'distance': 15, 'duration': 45},
            {'user_id': user_ids[5], 'type': 'swim', 'distance': 2, 'duration': 55},
        ]
        activities.insert_many(activity_data)

        # Workouts
        workout_data = [
            {'name': 'Morning Cardio', 'description': 'Run and cycle combo', 'team_id': marvel_id},
            {'name': 'Strength Training', 'description': 'Weights and resistance', 'team_id': dc_id},
        ]
        workouts.insert_many(workout_data)

        # Leaderboard
        leaderboard_data = [
            {'user_id': user_ids[0], 'points': 100},
            {'user_id': user_ids[1], 'points': 90},
            {'user_id': user_ids[2], 'points': 80},
            {'user_id': user_ids[3], 'points': 110},
            {'user_id': user_ids[4], 'points': 95},
            {'user_id': user_ids[5], 'points': 85},
        ]
        leaderboard.insert_many(leaderboard_data)

        self.stdout.write(self.style.SUCCESS('octofit_db database populated with test data.'))
