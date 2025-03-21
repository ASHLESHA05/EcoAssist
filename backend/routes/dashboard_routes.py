from flask import request, jsonify
from . import routes_bp  # Import the blueprint from __init__.py
from database.connection import get_db_connection  # Import database connection
import json

@routes_bp.route("/get-all-details", methods=["GET"])
def get_all_details():
    email = request.args.get("email")
    if not email:
        return jsonify({"error": "Email parameter is required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Fetch user_id from email
        cursor.execute("SELECT user_id FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()
        if not user:
            return jsonify({"message": "User not found"}), 404

        user_id = user[0]

        # Fetch dashboard metrics
        cursor.execute("""
            SELECT carbon_footprint_qty, prev_month_cmp, is_increase_carbon, remaining_monthly_goal,
                   water_saved, water_prev_month_cmp, is_increase_water, water_remaining_monthly_goal,
                   power_saved, power_prev_month_cmp, is_increase_power, power_remaining_monthly_goal,
                   waste_reduced, waste_prev_month_cmp, is_increase_waste, waste_remaining_monthly_goal
            FROM dashboard_metrics WHERE user_id = %s
        """, (user_id,))
        dashBoardMetrics = cursor.fetchone()

        # Fetch chart data
        cursor.execute("""
            SELECT weekly_data, monthly_data, yearly_data, max_data
            FROM chart_data WHERE user_id = %s
        """, (user_id,))
        chartData = cursor.fetchone()

        # Fetch ecoscore
        cursor.execute("""
            SELECT score, local_top_percentage FROM ecoscoredata WHERE user_id = %s
        """, (user_id,))
        ecoscore = cursor.fetchone()

        # Fetch badges (name, description, color)
        cursor.execute("""
            SELECT b.name, b.description, b.color
            FROM badges b
            JOIN user_badges ub ON b.badge_id = ub.badge_id
            WHERE ub.user_id = %s
        """, (user_id,))
        badges = cursor.fetchall()

        # Fetch user level
        cursor.execute("""
            SELECT Level FROM users WHERE user_id = %s
        """, (user_id,))
        level = cursor.fetchone()

        if dashBoardMetrics and chartData and ecoscore and level is not None:
            return jsonify({
                "dashBoardMetrics": {
                    "carbonFootPrintQty": dashBoardMetrics[0],
                    "PrevMonthCmp": dashBoardMetrics[1],
                    "isIncreaseCarbon": dashBoardMetrics[2],
                    "RemainingMonthlyGoal": dashBoardMetrics[3],
                    "waterSaved": dashBoardMetrics[4],
                    "waterPrevMonthCmp": dashBoardMetrics[5],
                    "isIncreaseWater": dashBoardMetrics[6],
                    "waterRemainingMonthlyGoal": dashBoardMetrics[7],
                    "powerSaved": dashBoardMetrics[8],
                    "powerPrevMonthCmp": dashBoardMetrics[9],
                    "isIncreasePower": dashBoardMetrics[10],
                    "powerRemainingMonthlyGoal": dashBoardMetrics[11],
                    "wasteReduced": dashBoardMetrics[12],
                    "wastePrevMonthCmp": dashBoardMetrics[13],
                    "isIncreaseWaste": dashBoardMetrics[14],
                    "wasteRemainingMonthlyGoal": dashBoardMetrics[15]
                },
                "chartData": {
                    "weeklyData": chartData[0],  
                    "monthlyData": chartData[1],
                    "yearlyData": chartData[2],
                    "maxData": chartData[3]
                },
                "ecoscore": {
                    "score": ecoscore[0],
                    "localTopPercentage": ecoscore[1]
                },
                "badges": [
                    {"name": badge[0], "description": badge[1], "color": badge[2]} for badge in badges
                ],
                "Level": level[0]
            }), 200
        else:
            return jsonify({"message": "User details incomplete"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()
